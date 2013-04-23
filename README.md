openITMO
========

Образовательный проект "Открытое онлайн-обучение" предоставляет бесплатный доступ к учебным электронным курсам [НИУ ИТМО](http://www.ifmo.ru/). Курсы содержат видеолекции, электронные презентации к ним, текстовые материалы, вопросы для самоконтроля, экзаменационные задания.

Познавайте новое в компактной форме в любой точке мира в удобное для себя время!

Описание
========

В основе подхода к разработке системы принята концепция веб-приложения. В отличие от обычного понимания веб-сайтов, где сервером генерируются контент и отсылается клиенту в виде HTML-страниц, здесь сайт представляет собой почти автономное приложение, работающее в браузере. Приложение динамически отслеживает свое состояние, обрабатывает действия пользователя и отображает данные, которые получает с сервера по запросу в формате [JSON](http://ru.wikipedia.org/wiki/JSON). В таком приложении пользователь получает более отзывчивую систему, экономно расходуются ресурсы сервера за счет динамической загрузки только необходимых в данный момент данных, страницы динамически изменяются на клиенте, а не генерируется полностью или частично на сервере.

Веб-приложение получает данные с сервера по средствам обращения к службе [REST](http://ru.wikipedia.org/wiki/REST). Данная служба представляет собой некоторый [API](http://ru.wikipedia.org/wiki/API), используя который приложение может получать и передавать динамически изменяющиеся данные для последующей их обработки и сохранения в базе данных (БД). Такой API в дальнейшем можно использовать при разработке других приложений, например мобильной версии сайта для маленьких экранов, либо версии приложения для мобильных устройств. Весь API можно расширять и гибко менять.

Серверная архитектура спроектирована с учетом возможности масштабирования системы, т. е. можно почти линейно наращивать вычислительную мощность путем увеличения количества серверных компонентов. В качестве серверной платформы используется [node.js](http://nodejs.org/), качестве front-end используется веб-сервер nginx. Для хранения данных используется не реляционная ([noSQL](http://ru.wikipedia.org/wiki/NoSQL)) документо-ориентированная СУБД [MongoDB](http://www.mongodb.org/), основным достоинством которой является возможность работы с большими объемами данных, масштабируемость и распределенность.

Каждый учебный курс состит из отдельных блоков (модулей), каждый из которых представляет собой шаблон JavaScript + HTML + CSS. По умолчанию есть набор готовых модулей:

 * описание курса;
 * структура курса;
 * объявления;
 * лекции, включающие ведеоролики, презентации и опросы для самопроверки;
 * проверочные работы;
 * страница дополнительных материалов, доступная для коллективного редаткирования;
 * форум;
 * страница рейтинга учащегося;
 * онтология.

Можно содавать новые модули, если предложенного функционала недостаточно. Каждый модуль состоит из клиентской и серверной части.

Разработка модулей как клиентской, так и серверной части может вестись на JavaScript, что весьма удобно — один язык как для клиента, так и для сервера, что позволяет использовать одни блоки кода на обоих сторонах (например, проверка форм). Помимо использования единого языка для программирования как клиентской, так и серверной части, хочется упомянуть наличие бесплатной облачной среды разработки [Cloud9](https://c9.io/),  что является еще одним плюсом для разработчиков модулей. Стоит отметить, что все данные делятся на две части — статические и динамические. Предполагается, что данные не меняющиеся со временем (например, содержимое курса) хранятся в файлах на веб-сервере, а динамически изменяемые данные (например, данные пользователей) хранятся в базе данных, доступ к которым можно получить прямо из веб-приложения через API.

Разработка клиентской части (веб-приложение) ведется на основе фреймворка [AngularJS](http://angularjs.org/) и библиотеки [jQuery](http://jquery.com/), в качестве шаблона оформления (стили и примитивы) используется [Twitter Bootstrap](http://twitter.github.io/bootstrap/). Видеоплеер [popcorn.js](http://www.popcornjs.org/).

При разработке проекта используется [свободное программное обеспечение](http://ru.wikipedia.org/wiki/Свободное_программное_обеспечение).

Лицензия
========

(с) НИУ ИТМО, 2013

Проект опубликован под лицензией [GPL версии 3](http://www.gnu.org/licenses/gpl-3.0.html) и выше. 

Адрес в Интернете: http://open.ifmo.ru/

