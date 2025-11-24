

import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Course, Progress, Goal, PointEvent } from './types';
import { INITIAL_COURSE_TOPICS, INITIAL_COURSES_DATA } from './constants';
import { generateCourse, generateDashboardImage } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CourseView from './components/CourseView';
import QuizView from './components/QuizView';
import Spinner from './components/Spinner';
import ProfileModal from './components/ProfileModal';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ChatWidget from './components/ChatWidget';
import { THEMES, Theme } from './themes';
import { supabase } from './services/supabase';
import { Session, User, PostgrestError } from '@supabase/supabase-js';

type ColorScheme = 'light' | 'dark';

const App: React.FC = () => {
    // Auth & View state
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [view, setView] = useState<AppView>(AppView.DASHBOARD);
    const [showAuthPage, setShowAuthPage] = useState(false);

    // App Data State
    const [courses, setCourses] = useState<Record<string, Course>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Verificando sua sessão...');
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);

    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [currentQuiz, setCurrentQuiz] = useState<{ courseId: string; lessonIndex: number } | null>(null);

    // User-specific data from Supabase
    const [progress, setProgress] = useState<Progress>({ coursesCompleted: [], quizzesPassed: {} });
    const [goals, setGoals] = useState<Goal[]>([]);
    const [pointsHistory, setPointsHistory] = useState<PointEvent[]>([]);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[0]);
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [dashboardImage, setDashboardImage] = useState<string | null>(null);


    const totalPoints = useMemo(() => pointsHistory.reduce((sum, event) => sum + event.points, 0), [pointsHistory]);

    // Auth listener
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            // Reset view if user logs out
            if (_event === 'SIGNED_OUT') {
                setView(AppView.DASHBOARD);
                setShowAuthPage(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch user data from Supabase when session changes
    useEffect(() => {
        if (session?.user) {
            const fetchUserData = async () => {
                setIsLoading(true);
                setLoadingMessage('Carregando seus dados...');
                try {
                    const userId = session.user.id;
                    
                    // Try to select with dashboard_image_url first
                    let profileRes = await supabase.from('profiles').select('profile_pic_url, active_theme_id, full_name, color_scheme, dashboard_image_url').eq('id', userId).single();

                    // Compatibility handling: If column doesn't exist (Code 42703), try fetching without it
                    if (profileRes.error && profileRes.error.code === '42703') {
                        console.warn("Coluna 'dashboard_image_url' não encontrada no banco de dados. Modo de compatibilidade ativado.");
                        profileRes = await supabase.from('profiles').select('profile_pic_url, active_theme_id, full_name, color_scheme').eq('id', userId).single();
                    }

                    if (profileRes.error && (profileRes.error as PostgrestError).code === 'PGRST116') {
                        console.log('No profile found, creating one for the new user...');
                        const { error: insertProfileError } = await supabase.from('profiles').insert({
                            id: userId,
                            full_name: session.user.user_metadata?.full_name
                        });
                        if (insertProfileError) throw insertProfileError;

                        const { error: insertProgressError } = await supabase.from('progress').insert({
                            user_id: userId
                        });
                        if (insertProgressError) throw insertProgressError;
                        
                        // Re-fetch after creation
                        profileRes = await supabase.from('profiles').select('profile_pic_url, active_theme_id, full_name, color_scheme, dashboard_image_url').eq('id', userId).single();
                        
                        // Handle missing column again on re-fetch
                        if (profileRes.error && profileRes.error.code === '42703') {
                             profileRes = await supabase.from('profiles').select('profile_pic_url, active_theme_id, full_name, color_scheme').eq('id', userId).single();
                        }
                    }
                    
                    if (profileRes.error) throw profileRes.error;

                    const [progressRes, goalsRes, pointsRes, userCoursesRes] = await Promise.all([
                        supabase.from('progress').select('*').eq('user_id', userId).single(),
                        supabase.from('goals').select('*').eq('user_id', userId),
                        supabase.from('points_history').select('*').eq('user_id', userId),
                        supabase.from('user_generated_courses').select('course_id, course_data').eq('user_id', userId)
                    ]);
                    
                    if (profileRes.data) {
                        setProfilePic(profileRes.data.profile_pic_url);
                        setUserName(profileRes.data.full_name);
                        const foundTheme = THEMES.find(t => t.id === profileRes.data.active_theme_id);
                        if(foundTheme) setActiveTheme(foundTheme);
                        if(profileRes.data.color_scheme) setColorScheme(profileRes.data.color_scheme as ColorScheme);
                        
                        // Handle dashboard image safely
                        if ('dashboard_image_url' in profileRes.data && profileRes.data.dashboard_image_url) {
                            setDashboardImage(profileRes.data.dashboard_image_url as string);
                        } else {
                            const dashboardPrompt = "Uma pessoa focada, sentada em uma mesa de trabalho moderna e organizada, analisando gráficos financeiros em um laptop. O ambiente é iluminado e otimista, com plantas e luz natural. Estilo vetorial, alta qualidade.";
                            generateDashboardImage(dashboardPrompt)
                                .then(base64Bytes => {
                                    const imageUrl = `data:image/png;base64,${base64Bytes}`;
                                    setDashboardImage(imageUrl);
                                    
                                    // Try to update, but ignore "column does not exist" error
                                    supabase.from('profiles').update({ dashboard_image_url: imageUrl }).eq('id', userId).then(({ error }) => {
                                        if (error && error.code !== '42703') console.error("Error saving dashboard image:", error);
                                    });
                                })
                                .catch(err => console.error("Failed to generate dashboard image in background:", err));
                        }

                        if (!profileRes.data.full_name && session.user.user_metadata?.full_name) {
                            await supabase.from('profiles').update({ full_name: session.user.user_metadata.full_name }).eq('id', userId);
                             setUserName(session.user.user_metadata.full_name);
                        }
                    }

                    if (progressRes.error) throw progressRes.error;
                    if (progressRes.data) {
                       setProgress({
                           coursesCompleted: progressRes.data.courses_completed || [],
                           quizzesPassed: progressRes.data.quizzes_passed || {}
                       });
                    }

                    if (goalsRes.error) throw goalsRes.error;
                    if (goalsRes.data) setGoals(goalsRes.data.map(g => ({...g, id: g.id})));

                    if (pointsRes.error) throw pointsRes.error;
                    if (pointsRes.data) setPointsHistory(pointsRes.data.map(p => ({...p, timestamp: Date.parse(p.timestamp as string)})));
                    
                    if (userCoursesRes.error) throw userCoursesRes.error;
                    const loadedCourses: Record<string, Course> = {};
                    if(userCoursesRes.data) {
                        userCoursesRes.data.forEach(c => {
                            loadedCourses[c.course_id] = c.course_data as Course;
                        });
                    }
                     
                    const userCourseIds = new Set(userCoursesRes.data?.map(c => c.course_id) || []);
                    const missingInitialCourse = INITIAL_COURSES_DATA.some(course => !userCourseIds.has(course.id));

                    if (missingInitialCourse) {
                        setLoadingMessage(`Configurando seus cursos iniciais...`);
                        
                        const newCoursesToInsert = INITIAL_COURSES_DATA.filter(course => !userCourseIds.has(course.id));

                        newCoursesToInsert.forEach(course => {
                            loadedCourses[course.id] = course;
                        });
                        
                        const initialCoursesToSaveToDb = newCoursesToInsert.map(course => ({
                            user_id: session.user.id,
                            course_id: course.id,
                            course_data: course as any,
                        }));


                        if (initialCoursesToSaveToDb.length > 0) {
                            const { error: insertError } = await supabase.from('user_generated_courses').insert(initialCoursesToSaveToDb);
                            if (insertError) {
                                console.error("Failed to save initial courses:", insertError);
                                // Se falhar, remove os cursos do estado local para não mostrar algo que não foi salvo
                                newCoursesToInsert.forEach(course => {
                                    delete loadedCourses[course.id];
                                });
                                throw insertError; 
                            }
                        }
                    }
                    
                    setCourses(loadedCourses);
                } catch (err: unknown) {
                    console.error("Error fetching user data:", err);
                    let errorMessage = "Não foi possível carregar seus dados. Tente recarregar a página.";
                    if (err instanceof Error) {
                        errorMessage = err.message;
                    } else if (typeof err === 'string') {
                        errorMessage = err as string;
                    } else if (err && typeof err === 'object' && 'message' in err) {
                         errorMessage = String((err as any).message);
                    }

                    // Suppress specific migration error to avoid locking the user out
                    if (errorMessage.includes('relation "public.profiles"') && errorMessage.includes('does not exist')) {
                        // This is critical, table doesn't exist
                        errorMessage = `Erro de configuração: A tabela 'profiles' não foi encontrada.`;
                    } else if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
                         // This is minor, we can ignore it in the UI and let the fallback handle it
                    }
                    
                    setError(errorMessage);
                } finally {
                    setIsLoading(false);
                    setLoadingMessage('');
                }
            };
            fetchUserData();
        } else {
            setCourses({});
            setProgress({ coursesCompleted: [], quizzesPassed: {} });
            setGoals([]);
            setPointsHistory([]);
            setProfilePic(null);
            setUserName(null);
            setDashboardImage(null);
            setActiveTheme(THEMES[0]);
            setColorScheme('light');
        }
    }, [session]);
    
    useEffect(() => {
        Object.entries(activeTheme.colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
        if(session?.user) {
            supabase.from('profiles').update({ active_theme_id: activeTheme.id }).eq('id', session.user.id).then();
        }
    }, [activeTheme, session]);

    useEffect(() => {
        if (colorScheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }, [colorScheme]);

    const handleSetColorScheme = (scheme: ColorScheme) => {
        if (!session?.user) return;
        setColorScheme(scheme);
        supabase.from('profiles').update({ color_scheme: scheme }).eq('id', session.user.id).then(({ error }) => {
            if (error) console.error("Error updating color scheme:", error);
        });
    };

    // Handlers
    const handleSelectCourse = (courseId: string) => {
        setSelectedCourseId(courseId);
        setView(AppView.COURSE_VIEW);
    };

    const handleBackToDashboard = () => {
        setSelectedCourseId(null);
        setCurrentQuiz(null);
        setView(AppView.DASHBOARD);
    };

    const handleStartQuiz = (courseId: string, lessonIndex: number) => {
        setCurrentQuiz({ courseId, lessonIndex });
        setView(AppView.QUIZ_VIEW);
    };

    const handleCompleteQuiz = async (score: number, total: number) => {
        if (currentQuiz && user) {
            const { courseId, lessonIndex } = currentQuiz;
            if (score / total >= 0.7) {
                const quizzesForCourse = progress.quizzesPassed[courseId] || [];
                if (!quizzesForCourse.includes(lessonIndex)) {
                    const newPointEvent = { user_id: user.id, points: 50, reason: 'Quiz Passou' };
                    const { data: pointData } = await supabase.from('points_history').insert(newPointEvent).select().single();
                    if(pointData) setPointsHistory(h => [...h, {...pointData, timestamp: Date.parse(pointData.timestamp)}]);
                    
                    const newQuizzesPassed = { ...progress.quizzesPassed, [courseId]: [...quizzesForCourse, lessonIndex] };
                    const course = courses[courseId];
                    let newCoursesCompleted = [...progress.coursesCompleted];

                    if (course && course.lessons.length === newQuizzesPassed[courseId].length && !newCoursesCompleted.includes(courseId)) {
                        newCoursesCompleted.push(courseId);
                        const courseCompleteEvent = { user_id: user.id, points: 100, reason: 'Curso Completo' };
                        const { data: ccPointData } = await supabase.from('points_history').insert(courseCompleteEvent).select().single();
                        if(ccPointData) setPointsHistory(h => [...h, {...ccPointData, timestamp: Date.parse(ccPointData.timestamp)}]);
                    }

                    const newProgress = { ...progress, coursesCompleted: newCoursesCompleted, quizzesPassed: newQuizzesPassed };
                    setProgress(newProgress);
                    await supabase.from('progress').update({ courses_completed: newProgress.coursesCompleted, quizzes_passed: newProgress.quizzesPassed }).eq('user_id', user.id);
                }
            }
            setView(AppView.COURSE_VIEW);
            setCurrentQuiz(null);
        }
    };

    const handleAddGoal = async (text: string) => {
        if (!user) return;
        const { data, error } = await supabase.from('goals').insert({ user_id: user.id, text, completed: false }).select().single();
        if (data) setGoals(prev => [...prev, {...data, id: data.id}]);
        if(error) {
            console.error("Error adding goal:", error);
            setError("Não foi possível adicionar a meta.");
        }
    };

    const handleGoalToggle = async (goalId: number) => {
        if (!user) return;
        
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return;

        const newCompletedState = !goal.completed;
        setGoals(goals.map(g => g.id === goalId ? { ...g, completed: newCompletedState } : g));
        
        if (newCompletedState) {
            const newPointEvent = { user_id: user.id, points: 25, reason: 'Meta Concluída' };
            const { data: pointData } = await supabase.from('points_history').insert(newPointEvent).select().single();
            if(pointData) setPointsHistory(h => [...h, {...pointData, timestamp: Date.parse(pointData.timestamp)}]);
        }

        const { error } = await supabase.from('goals').update({ completed: newCompletedState }).eq('id', goalId);
        if (error) {
            console.error('Error updating goal:', error);
            setGoals(goals.map(g => g.id === goalId ? { ...g, completed: !newCompletedState } : g));
            setError("Não foi possível atualizar a meta.");
        }
    };

    const handleGenerateCourse = async (topic: string, difficulty: 'beginner' | 'intermediate') => {
        if (!user) return;
        setIsGeneratingCourse(true);
        setError(null);
        try {
            const courseContent = await generateCourse(topic, difficulty);
            const newCourseId = topic.toLowerCase().replace(/\s+/g, '-') + `-${Date.now()}`;
            const newCourse: Course = { id: newCourseId, title: topic, ...courseContent };
            
            const { error: dbError } = await supabase.from('user_generated_courses').insert({
                user_id: user.id,
                course_id: newCourse.id,
                course_data: newCourse as any,
            });

            if (dbError) throw dbError;

            setCourses(prev => ({ ...prev, [newCourse.id]: newCourse }));
        } catch (err: unknown) {
            // FIX: Improve error handling for unknown type by using safer type guards and explicit string conversion.
            console.error("Error generating or saving course:", err);
            let errorMessage = "Ocorreu um erro desconhecido ao gerar o curso. Tente novamente.";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            } else if (err && typeof err === 'object' && 'message' in err) {
                 // FIX: Cast error object to 'any' to ensure its message property is correctly handled as a string.
                 errorMessage = String((err as any).message);
            }
            setError(errorMessage);
        } finally {
            setIsGeneratingCourse(false);
        }
    };
    
    const handleUpdateProfilePic = async (imageDataUrl: string) => {
        if (!user) return;
        setProfilePic(imageDataUrl);
        setShowProfileModal(false);

        const { error } = await supabase.from('profiles').update({ profile_pic_url: imageDataUrl }).eq('id', user.id);
        
        if (error) {
            console.error("Error updating profile picture:", error);
            setError("Não foi possível salvar a foto de perfil.");
        }
    };

    const handleSignOut = async () => {
        setShowProfileModal(false);
        await supabase.auth.signOut();
    };

    if (isLoading) {
        return (
            <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center text-slate-800 dark:text-white">
                <Spinner />
                <p className="mt-4 text-lg">{loadingMessage}</p>
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 p-8 rounded-lg text-center max-w-lg">
                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">Ocorreu um Erro</h2>
                    <p className="text-red-600 dark:text-red-200 whitespace-pre-wrap">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                    >
                        Recarregar a Página
                    </button>
                </div>
            </div>
        );
    }

    if (!session) {
        return showAuthPage ? <AuthPage /> : <LandingPage onLoginClick={() => setShowAuthPage(true)} />;
    }

    const selectedCourse = selectedCourseId ? courses[selectedCourseId] : null;
    const quizData = currentQuiz ? courses[currentQuiz.courseId]?.lessons[currentQuiz.lessonIndex]?.quiz : null;

    const renderView = () => {
        switch (view) {
            case AppView.COURSE_VIEW:
                return selectedCourse ? (
                    <CourseView
                        course={selectedCourse}
                        progress={progress}
                        onStartQuiz={handleStartQuiz}
                        onBack={handleBackToDashboard}
                    />
                ) : null;
            case AppView.QUIZ_VIEW:
                return quizData && currentQuiz ? (
                    <QuizView
                        quizQuestions={quizData}
                        courseTitle={courses[currentQuiz.courseId].lessons[currentQuiz.lessonIndex].title}
                        onComplete={handleCompleteQuiz}
                    />
                ) : null;
            case AppView.DASHBOARD:
            default:
                return (
                    <Dashboard
                        courses={Object.values(courses)}
                        progress={progress}
                        goals={goals}
                        points={totalPoints}
                        pointsHistory={pointsHistory}
                        onSelectCourse={handleSelectCourse}
                        onAddGoal={handleAddGoal}
                        onGoalToggle={handleGoalToggle}
                        onGenerateCourse={handleGenerateCourse}
                        isGeneratingCourse={isGeneratingCourse}
                        generationError={error}
                        activeTheme={activeTheme}
                        userName={userName}
                        dashboardImage={dashboardImage}
                    />
                );
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen relative">
            <Header 
                onLogoClick={handleBackToDashboard}
                profilePic={profilePic}
                onProfileClick={() => setShowProfileModal(true)}
            />
            <main className="py-8 px-4 sm:px-6 lg:px-8 pb-24">
                {renderView()}
            </main>
            
            <ChatWidget />

            {showProfileModal && (
                <ProfileModal
                    onClose={() => setShowProfileModal(false)}
                    onSave={handleUpdateProfilePic}
                    currentImage={profilePic}
                    activeTheme={activeTheme}
                    onThemeChange={(themeId) => {
                        const newTheme = THEMES.find(t => t.id === themeId);
                        if (newTheme) setActiveTheme(newTheme);
                    }}
                    onSignOut={handleSignOut}
                    colorScheme={colorScheme}
                    onColorSchemeChange={handleSetColorScheme}
                />
            )}
        </div>
    );
};

export default App;