// src/app/privacy/page.tsx
import React from "react";
import Head from "next/head";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Head>
        <title>Политика Конфиденциальности - [Название вашего проекта]</title>
        <meta
          name="description"
          content="Ознакомьтесь с нашей политикой конфиденциальности."
        />
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl text-gray-900 dark:text-gray-100">
          <header className="mb-10 md:mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Политика Конфиденциальности
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Последнее обновление:{" "}
              {new Date().toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          <div className="space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                1. Введение
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-2">
                Добро пожаловать в AnimeHub . Мы обязуемся защищать вашу личную
                информацию. Если у вас есть вопросы, свяжитесь с нами по адресу
                Astana Polytech
                <a
                  href="mailto:[ваш контактный email]"
                  className="text-brand-primary hover:underline"
                >
                  Zanshugurov07@gmail.com
                </a>
                .
              </p>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Эта политика применяется ко всей информации, собранной через наш
                веб-сайт http://localhost:3000/ и связанные Услуги.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                2. Какую информацию мы собираем?
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-2">
                Мы собираем личную информацию, которую вы добровольно
                предоставляете нам.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-2">
                Собираемая информация включает: [например, Имя, Email, Имя
                пользователя, Пароль, Контент пользователя и т.д.].
              </p>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Мы также автоматически собираем техническую информацию
                (IP-адрес, тип браузера и устройства и т.д.) при использовании
                Услуг.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                3. Как мы используем вашу информацию?
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-2">
                Мы используем вашу информацию для предоставления и улучшения
                Услуг, общения с вами и соблюдения юридических обязательств.
              </p>
              <ul className="list-disc list-inside text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 space-y-1 pl-4">
                <li>Обеспечение работы учетных записей.</li>
                <li>Публикация отзывов (с вашего согласия).</li>
                <li>Запрос обратной связи.</li>
                <li>Отправка административной информации.</li>
                <li>Защита наших Услуг.</li>
                <li>
                  [Добавьте другие способы использования, специфичные для вашего
                  проекта]
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                4. Будет ли ваша информация передаваться кому-либо?
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Мы делимся информацией только с вашего согласия, для соблюдения
                законов, предоставления услуг или защиты ваших прав. [Укажите
                конкретные случаи, если есть, например, сторонние поставщики].
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                5. Как долго мы храним вашу информацию?
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Мы храним вашу информацию столько, сколько необходимо для целей,
                изложенных в этой политике, или в соответствии с требованиями
                законодательства.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                6. Как мы обеспечиваем безопасность вашей информации?
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Мы принимаем технические и организационные меры для защиты вашей
                информации, но не можем гарантировать абсолютную безопасность.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                7. Ваши права на конфиденциальность
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Вы имеете право запрашивать доступ, исправление или удаление
                вашей личной информации. Для этого свяжитесь с нами.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                8. Обновления этой политики
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Мы можем обновлять эту политику. Обновленная версия вступит в
                силу после публикации. Рекомендуем регулярно проверять эту
                страницу.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                9. Как вы можете связаться с нами по поводу этой политики?
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Вопросы или комментарии направляйте на{" "}
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

export default PrivacyPolicyPage;
