// src/app/about/page.tsx
import React from "react";
import Head from "next/head";

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>О нас - [Название вашего проекта]</title>
        <meta
          name="description"
          content="Узнайте больше о [Название вашего проекта] и нашей миссии."
        />
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl text-gray-900 dark:text-gray-100">
          <header className="mb-10 md:mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">О Нас</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Узнайте больше о нашей команде, миссии и ценностях.
            </p>
          </header>

          <div className="space-y-8">
            <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Наша Миссия
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                Добро пожаловать в AnimeHub! Мы стремимся предоставить вам
                лучший опыт в [опишите, чем занимается ваш проект]. Наша миссия
                — [сформулируйте вашу миссию].
              </p>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Мы верим в [ваши ключевые ценности] и постоянно работаем над
                улучшением нашей платформы для вас.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Кто Мы
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                Мы — команда энтузиастов, разработчиков и дизайнеров,
                объединенных общей страстью к [основная идея вашего проекта]. Мы
                стремимся создать платформу, которая будет не только
                функциональной, но и приятной в использовании.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Этот проект зародился из [кратко опишите историю или идею
                возникновения проекта] и продолжает развиваться благодаря
                поддержке и отзывам наших пользователей.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Свяжитесь с Нами
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Мы будем рады услышать вас! Если у вас есть вопросы или
                предложения, пишите нам на{" "}
                <a
                  href="mailto:[ваш контактный email]"
                  className="text-brand-primary hover:underline"
                >
                  Zanshugurov07@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
