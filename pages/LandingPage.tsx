
import React, { useState, useEffect } from 'react';
import { generateLandingPageImage, generateFeatureIcon } from '../services/geminiService';
import Spinner from '../components/Spinner';

const ImagePlaceholder: React.FC<{className?: string}> = ({ className }) => (
    <div className={`w-full bg-slate-700/50 rounded-lg animate-pulse ${className}`}>
        <div className="flex items-center justify-center h-full">
            <Spinner />
        </div>
    </div>
);

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const [heroImage, setHeroImage] = useState<string | null>(null);
    const [featureImage1, setFeatureImage1] = useState<string | null>(null);
    const [featureImage2, setFeatureImage2] = useState<string | null>(null);
    const [featureImage3, setFeatureImage3] = useState<string | null>(null);
    const [secondaryHeroImage, setSecondaryHeroImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Prompt ajustado para: Professora e alunos
                const heroPrompt = "Uma professora carismática ensinando educação financeira para um grupo de alunos em uma sala de aula moderna e colorida. Ela está apontando para um quadro interativo com ícones de moedas e gráficos de crescimento. Os alunos estão sorrindo e engajados. Estilo ilustração vetorial flat design, cores vibrantes, alta qualidade, sem distorções anatômicas.";
                const feature1Prompt = "Um livro digital interativo com gráficos e ícones de quiz saindo dele.";
                const feature2Prompt = "Um cofrinho de porco com uma medalha de ouro, cercado por moedas brilhantes.";
                const feature3Prompt = "Um cérebro com uma lâmpada acesa dentro, simbolizando a criação de ideias e aprendizado personalizado.";
                const secondaryHeroPrompt = "Uma mulher amigável apresentando um aplicativo em um tablet para duas crianças felizes e engajadas. O ambiente é uma sala de aula colorida e moderna. Estilo de ilustração vetorial, quente e convidativo.";

                const [
                    heroImgData,
                    feature1ImgData,
                    feature2ImgData,
                    feature3ImgData,
                    secondaryHeroImgData
                ] = await Promise.all([
                    generateLandingPageImage(heroPrompt),
                    generateFeatureIcon(feature1Prompt),
                    generateFeatureIcon(feature2Prompt),
                    generateFeatureIcon(feature3Prompt),
                    generateLandingPageImage(secondaryHeroPrompt)
                ]);

                setHeroImage(`data:image/png;base64,${heroImgData}`);
                setFeatureImage1(`data:image/png;base64,${feature1ImgData}`);
                setFeatureImage2(`data:image/png;base64,${feature2ImgData}`);
                setFeatureImage3(`data:image/png;base64,${feature3ImgData}`);
                setSecondaryHeroImage(`data:image/png;base64,${secondaryHeroImgData}`);
            } catch (error) {
                console.error("Falha ao gerar imagens para a landing page:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

  return (
    <div className="bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-[rgb(var(--color-primary-light))] to-[rgb(var(--color-accent-light))] rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xl">F</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">FinEduca</h1>
            </div>
            <button
              onClick={onLoginClick}
              className="bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] text-white font-bold py-2 px-5 rounded-md transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 text-center lg:text-left bg-slate-800/20 overflow-hidden">
             <div className="absolute inset-0 bg-grid-slate-700/[0.05] [mask-image:linear-gradient(0deg,#000000,rgba(0,0,0,0))]"></div>
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight">
                            Desvende o Mundo das Finanças.
                        </h2>
                        <h3 className="mt-4 text-4xl lg:text-6xl font-extrabold tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-light))] to-[rgb(var(--color-accent-light))]">
                                De um jeito divertido.
                            </span>
                        </h3>
                        <p className="mt-6 max-w-2xl text-lg text-slate-300 lg:mx-0 mx-auto">
                            O FinEduca transforma a complexidade da educação financeira em uma jornada interativa e gamificada. Aprenda, jogue e conquiste suas metas!
                        </p>
                        <div className="mt-10 flex justify-center lg:justify-start">
                             <button
                                onClick={onLoginClick}
                                className="bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105"
                            >
                                Comece a aprender agora!
                            </button>
                        </div>
                    </div>
                    <div>
                        {isLoading ? (
                             <ImagePlaceholder className="aspect-video" />
                        ) : heroImage ? (
                            <img src={heroImage} alt="Professora ensinando alunos sobre finanças" className="rounded-2xl shadow-2xl shadow-slate-900/50" />
                        ) : (
                            <ImagePlaceholder className="aspect-video" />
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">Por que o FinEduca?</h2>
                    <p className="mt-4 text-lg text-slate-400">Tudo o que você precisa para dominar suas finanças.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="h-24 flex items-center justify-center mb-4">
                            {isLoading ? <Spinner/> : featureImage1 ? <img src={featureImage1} alt="Ícone de Cursos Interativos" className="h-24 w-24 object-contain" /> : <Spinner/>}
                        </div>
                        <h3 className="text-xl font-bold text-white">Cursos Interativos</h3>
                        <p className="mt-2 text-slate-400">Aprenda sobre impostos, investimentos e orçamento com lições e quizzes criados por IA.</p>
                    </div>
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="h-24 flex items-center justify-center mb-4">
                           {isLoading ? <Spinner/> : featureImage2 ? <img src={featureImage2} alt="Ícone de Metas e Recompensas" className="h-24 w-24 object-contain" /> : <Spinner/>}
                        </div>
                        <h3 className="text-xl font-bold text-white">Metas e Recompensas</h3>
                        <p className="mt-2 text-slate-400">Defina suas metas financeiras e ganhe pontos ao completar cursos e desafios.</p>
                    </div>
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="h-24 flex items-center justify-center mb-4">
                            {isLoading ? <Spinner/> : featureImage3 ? <img src={featureImage3} alt="Ícone de Aprendizado Personalizado" className="h-24 w-24 object-contain" /> : <Spinner/>}
                        </div>
                        <h3 className="text-xl font-bold text-white">Aprendizado Personalizado</h3>
                        <p className="mt-2 text-slate-400">Crie seus próprios cursos sobre qualquer tópico financeiro que desejar aprender.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* New "For All Ages" section */}
        <section className="py-20 lg:py-24 bg-slate-800/20">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-last lg:order-first">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">Educação Financeira para Todos</h2>
                        <p className="mt-4 text-lg text-slate-400">
                           O FinEduca foi projetado para ser intuitivo e divertido para todas as idades. Seja você um jovem dando os primeiros passos no mundo financeiro ou um adulto buscando aprimorar seus conhecimentos, nossa plataforma se adapta a você.
                        </p>
                         <button
                            onClick={onLoginClick}
                            className="mt-8 bg-transparent border-2 border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent))] text-[rgb(var(--color-accent))] hover:text-white font-bold py-3 px-8 rounded-full text-lg transition-all"
                        >
                            Junte-se à comunidade
                        </button>
                    </div>
                     <div>
                        {isLoading ? (
                             <ImagePlaceholder className="aspect-video" />
                        ) : secondaryHeroImage ? (
                            <img src={secondaryHeroImage} alt="Mulher mostrando o app para crianças" className="rounded-2xl shadow-2xl shadow-slate-900/50" />
                        ) : (
                             <ImagePlaceholder className="aspect-video" />
                        )}
                    </div>
                </div>
            </div>
        </section>
        
        {/* FAQ Section */}
        <section className="bg-slate-800/20 py-20 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">Perguntas Frequentes</h2>
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-[rgb(var(--color-primary-light))]">O FinEduca é gratuito?</h3>
                        <p className="mt-2 text-slate-400">Sim! O FinEduca é totalmente gratuito. Nosso objetivo é tornar a educação financeira acessível para todos.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-[rgb(var(--color-primary-light))]">Para quem é este aplicativo?</h3>
                        <p className="mt-2 text-slate-400">Para qualquer pessoa que queira aprender sobre finanças de uma forma simples e descontraída, desde iniciantes completos até aqueles que desejam aprofundar seus conhecimentos.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-[rgb(var(--color-primary-light))]">Como os cursos são criados?</h3>
                        <p className="mt-2 text-slate-400">Utilizamos a API do Gemini do Google para gerar conteúdo educacional de alta qualidade, garantindo que os cursos sejam didáticos, atualizados e relevantes.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} FinEduca Project. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
