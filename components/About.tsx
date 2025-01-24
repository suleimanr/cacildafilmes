import React from 'react';

const About: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center p-8 bg-white">
      <div className="max-w-4xl text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-8">Sobre Nós</h2>
        <p className="text-xl mb-8">
          Usamos o design e a tecnologia para criar aulas autênticas, funcionais e que prendam a atenção.
        </p>
        <p className="text-lg">
          Integramos profissionais da publicidade, cinema e da criação de conteúdo: Fotógrafos, ilustradores, designers, cenógrafos, roteiristas, designers de aprendizagem e gestores de projetos que trabalham juntos para criar e produzir conteúdos videográficos e instrucionais em diversas esferas.
        </p>
      </div>
    </section>
  );
};

export default About;

