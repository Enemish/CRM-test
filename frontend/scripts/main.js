/* Задачи:
7 приступить к стилизации!
10 оптимизировать код добавления нового клиента
*/

(function () {
    /* Кнопка "Добавить клиента" */
    const addClientBtn = document.getElementById("add-client-button");
    /* Кнопка "Добавить клиента" активна по умолчанию */
    addClientBtn.disabled = false;
    const clientForm = document.getElementById("client-form");
    const nameInput = document.getElementById("name-input");
    const surnameInput = document.getElementById("surname-input");
    const lastNameInput = document.getElementById("last-name-input");
    const contactsBox = document.getElementById("contacts");
    const closeBtn = document.getElementById("close-modal-button");
    const saveBtn = document.getElementById("save-contact-button");
    const addContactBtn = document.getElementById("add-contact-button");
    const clientModal = document.getElementById("client-modal");
    const modalHeader = document.querySelector(".modal-hdr");
    const modalHeaderId = document.querySelector(".modal-hdr-id");
    const deleteWindow = document.getElementById("deleteWindow");
    deleteWindow.style.display = "none";
    /* кнопка обновления контакта в модальном окне */
    const updateButton = newButton("Сохранить", "update-button", "button");
    /* Переменные кнопок действия в строке клиента */
    let updateButtonRow;
    let deleteButtonRow;
    /* Переменная контактов клиента */
    let clientContacts;
    /* Переменная учета количества контактов у Клиента */
    let currentClient = 0;
    /* Пустой массив клиентов */
    let clients = [];
    /* Переменная кнопки удаления контакта в модальном окне */
    let deleteButtonContact;
    let deleteModalClient;
    /* Массив выпадающего списка контактов */
    const contactTypes = [
        "Телефон",
        "Доп. телефон",
        "Email",
        "VK",
        "Facebook",
        "Другое",
    ];
    const contactPlaceholder = {
        tel: "+712345678910",
        email: "example@mail.ru",
        site: "http://example-site.ru",
    };

    /* Элементы */
    let tableBody = document.querySelector("#client-table tbody");
    function newRow() {
        return document.createElement("tr");
    }
    function newTd() {
        return document.createElement("td");
    }
    function newUl() {
        return document.createElement("ul");
    }
    function newLi() {
        return document.createElement("li");
    }
    function newIcon() {
        return document.createElement("i");
    }
    function newSpan() {
        return document.createElement("span");
    }
    function newButton(text, classes, typeBtn, onclick) {
        let button = document.createElement("button");
        button.textContent = text;
        button.classList.add(classes);
        if (typeBtn) {
            button.type = typeBtn;
        }
        button.onclick = onclick;
        return button;
    }
    function newDiv() {
        return document.createElement("div");
    }
    function newSelect() {
        return document.createElement("select");
    }
    function newInput() {
        return document.createElement("input");
    }
    function newOption() {
        return document.createElement("option");
    }
    function newIcon(type) {
        let iconElement = document.createElement('span');
        let classMap = {
            "Телефон": "contact-icon contact-icon-phone",
            "Доп. телефон": "contact-icon contact-icon-add-phone",
            "Email": "contact-icon contact-icon-email",
            "VK": "contact-icon contact-icon-vk",
            "Facebook": "contact-icon contact-icon-facebook",
            "Другое": "contact-icon contact-icon-other"
        };
        iconElement.className = classMap[type] || "contact-icon";
        return iconElement;
    }

    /* ------FUNCTIONS---------*/
    /* Загружаем список студентов с сервера */
    async function openListClients() {
        const response = await fetch("http://localhost:3000/api/clients");
        const data = await response.json();
        clients = data;

        renderClientsTable(clients);
        console.log(clients);
    }
    /* Добавление клиента в базу данных */
    async function addClient(client) {
        await fetch("http://localhost:3000/api/clients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(client),
        });
        openListClients();
        clientForm.reset();
    }
    /* Удаление клиента с сервера */
    async function deleteClient(clientId) {
        await fetch(`http://localhost:3000/api/clients/${clientId}`, {
            method: "DELETE",
        });
        openListClients();
        clientModal.style.display = "none";
        contactsBox.innerHTML = "";
        addClientBtn.disabled = false;
    }
    /* Обновление данных о клиенте на сервере */
    async function updateClient(clientId, updatedData) {
        await fetch(`http://localhost:3000/api/clients/${clientId}`, {
            method: "PATCH", // Указываем метод запроса
            headers: {
                "Content-Type": "application/json", // Указываем тип содержимого в теле запроса
            },
            body: JSON.stringify(updatedData), // Конвертируем JavaScript-объект в строку JSON
        });
        console.log(updatedData);
        openListClients();
        clientForm.reset();
    }
    /* Функция первой заглавной буквы в ФИО */
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    /* Функция для форматирования даты в формате "дд.мм.год" */
    function formatDate(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        // Проверяем, нужно ли добавить ведущий ноль
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        return day + "." + month + "." + year + " " + hours + ":" + minutes;
    }
    /* Функция очистки контактных данных после обновления или закрытия формы */
    function clearContactsBox() {
        while (contactsBox.firstChild) {
            contactsBox.removeChild(contactsBox.firstChild);
        }
        document.querySelectorAll("input").forEach((inp) => {
            inp.style.borderColor = "black";
            document.querySelector(".modal-error-msg").innerHTML = "";
            document.querySelectorAll(".contact-error").forEach((errInp) => {
                errInp.innerHTML = "";
            });
        });
    }
    /* Функция подставления иконки под контакт */
    function replacingIconContact(clientContacts, contactList) {
        const visibleLimit = 4;
        let hasMoreContacts = clientContacts.length > visibleLimit;

        clientContacts.forEach((contact, index) => {
            let contactItem = newLi();
            contactItem.className = "contact-item";
            contactItem.tabIndex = 0;

            /* Прячем контакты, если их больше четырех */
            if (index >= visibleLimit) {
                contactItem.className += " hidden";
            }

            let iconElement = newIcon(contact.type);
            let valueContainer = newSpan();
            valueContainer.className = "contact-value";
            valueContainer.textContent = `${contact.type}: ${contact.value}`;

            contactItem.appendChild(iconElement);
            contactItem.appendChild(valueContainer);
            contactList.appendChild(contactItem);
        });

        /* Если контактов больше четырех, добавляем кнопку для расширения списка */
        if (hasMoreContacts) {
            let expandButton = newExpandButton(clientContacts.length - visibleLimit, contactList);
            contactList.appendChild(expandButton);
        }
    }
    function newExpandButton(remainingCount, contactList) {
        let button = document.createElement('button');
        button.textContent = `+${remainingCount}`;
        button.className = 'expand-button';
        button.onclick = () => toggleContactVisibility(button, remainingCount, contactList);
        return button;
    }
    function toggleContactVisibility(button, count, contactList) {
        // Получаем все элементы класса .contact-item внутри переданного контейнера
        let hiddenItems = Array.from(contactList.querySelectorAll('.contact-item.hidden'));
        let visibleLimit = 4;

        if (hiddenItems.length > 0) {
            // Если скрытые элементы есть, показываем их
            hiddenItems.forEach(item => item.classList.remove('hidden'));
            button.textContent = `-${count}`;
        } else {
            // Получаем все элементы и скрываем те, что сверх лимита
            let allItems = Array.from(contactList.querySelectorAll('.contact-item'));
            allItems.slice(visibleLimit).forEach(item => item.classList.add('hidden'));
            button.textContent = `+${count}`;
        }
    }
    function openDeleteWindow(clientId) {
        deleteWindow.style.display = "block";

        document.querySelector(".deleteWindow__del-btn").onclick = () => {
            deleteClient(clientId);
            deleteWindow.style.display = "none";
        };

        document.querySelector(".deleteWindow__close-btn").onclick = () =>
            (deleteWindow.style.display = "none");
    }
    /* Отрисовка массива clients[] */
    function renderClientsTable(clients) {
        /* Очищаем содержимое тела таблицы */
        tableBody.innerHTML = "";

        /* Перебираем каждого клиента в массиве и создаем строку таблицы для каждого клиента */
        clients.forEach(function (client) {
            // Создаем новую строку таблицы
            let row = newRow();

            /* ID Клиента */
            let clientId = client.id;
            let clientIdCell = newTd();
            clientIdCell.textContent = Number(clientId);
            row.appendChild(clientIdCell);

            /* ФИО Клиента */
            let fullName =
                capitalizeFirstLetter(client.name) +
                " " +
                capitalizeFirstLetter(client.surname) +
                " " +
                capitalizeFirstLetter(client.lastName);
            let fullNameCell = newTd();
            fullNameCell.textContent = fullName;
            row.appendChild(fullNameCell);

            /* Дата и время создания */
            let createdAt = new Date(client.createdAt);
            let createdAtCell = newTd();
            createdAtCell.textContent = formatDate(createdAt);
            row.appendChild(createdAtCell);

            /* Дата и время Обновления */
            let updatedAt = new Date(client.updatedAt);
            let updatedAtCell = newTd();
            updatedAtCell.textContent = formatDate(updatedAt);
            row.appendChild(updatedAtCell);

            /* Контакты клиента */
            clientContacts = client.contacts;
            let clientContactCell = newTd();
            let contactList = newUl();
            contactList.className = "contact-tbl";

            /* Функция подставления иконок под контакты если такие есть */
            replacingIconContact(clientContacts, contactList);

            clientContactCell.appendChild(contactList);
            row.appendChild(clientContactCell);

            /* Действия (изменение, удаление) */
            let actionsCell = newTd();

            /* Создаем кнопку изменения в строке */
            updateButtonRow = newButton(
                "Изменить",
                "update-button-row",
                "",
                () => openModalClient(client)
            );
            actionsCell.appendChild(updateButtonRow);

            /* Создаем кнопку удаления */
            deleteButtonRow = newButton(
                "Удалить",
                "delete-button-row",
                "",
                () => openDeleteWindow(clientId)
            );
            actionsCell.appendChild(deleteButtonRow);

            /* Добавляем ячейку действий в строку */
            row.appendChild(actionsCell);

            /* Добавляем гиперссылку каждому клинту */
            const baseLink = `${window.location.protocol}//${window.location.host}/`;
            let clientLink = baseLink + `#${clientId}`;
            const createLink = newButton(
                "Копировать URL",
                "copy-url-btn",
                "",
                () => copyUrlClient(clientLink, createLink)
            );
            row.appendChild(createLink);

            /* Добавляем строку в тело таблицы */
            tableBody.appendChild(row);
        });
    }
    /* Открытие модального окна для изменения данных клиента */
    function openModalClient(client) {
        clientContacts = client.contacts;
        let clientId = client.id;
        clearContactsBox();
        /* Делаем кнопку "Добавить клиента" не активной */
        addClientBtn.disabled = true;
        /* Делаем другие кнопки "изменить" не активные*/
        document.querySelectorAll(".update-button-row").forEach(function (btn) {
            btn.disabled = true;
        });
        /* Делаем другие кнопки "удалить" не активные*/
        document.querySelectorAll(".delete-button-row").forEach(function (btn) {
            btn.disabled = true;
        });

        if (updateButton) {
            updateButton.remove();
        }
        if (deleteModalClient) {
            deleteModalClient.remove();
        }
        currentClient = clientContacts.length;

        updateAddContactButtonState(currentClient, addContactBtn);

        /* Открываем модальное окно */
        clientModal.style.display = "block";

        modalHeader.innerHTML = "Изменить данные";
        modalHeaderId.innerHTML = clientId;

        nameInput.value = capitalizeFirstLetter(client.name);
        surnameInput.value = capitalizeFirstLetter(client.surname);
        lastNameInput.value = capitalizeFirstLetter(client.lastName);

        /* Отображаем типы контактов и сами контакты клиента если они есть в модальном окне */
        if (clientContacts && clientContacts.length > 0) {
            for (let contact of clientContacts) {
                const contactDiv = newDiv();
                const contactTextError = newSpan();
                contactTextError.classList.add("contact-error");
                const contactUpSelect = newSelect();
                const contactUpInput = newInput();
                contactUpInput.value = contact.value;

                /* Создали и добавили кнопку удаления контакта и блока добавления контакта */
                deleteButtonContact = newButton(
                    "Удалить контакт",
                    "delete-button-contact",
                    "button"
                );
                deleteButtonContact.addEventListener("click", function () {
                    contactDiv.remove();
                    currentClient--;
                    updateAddContactButtonState(currentClient, addContactBtn);
                });

                /* Итерация по всем возможным типам контактов */
                for (let contactType of contactTypes) {
                    const option = newOption();
                    option.value = contactType;
                    option.text = contactType;

                    // Если текущий тип контакта совпадает с типом из списка, выберем эту опцию
                    if (contact.type === contactType) {
                        option.selected = true;
                    }

                    contactUpSelect.appendChild(option);
                }
                /* Создали и добавили блок добавления контакта */
                contactDiv.appendChild(contactUpSelect);
                contactDiv.appendChild(contactTextError);
                contactDiv.appendChild(contactUpInput);
                contactDiv.appendChild(deleteButtonContact);
                contactsBox.appendChild(contactDiv);
            }
        } else {
            // Удаление всех блоков контактов
            clearContactsBox();
        }

        /* Убираем кнопку сохранить в модальном окне */
        saveBtn.style.display = "none";

        /* Создаем кнопку Обновить в модальном окне*/
        clientForm.appendChild(updateButton);
        /* Создаем кнопку удалить в модальном окне */
        deleteModalClient = newButton(
            "Удалить клиента",
            "delete-modal-Client",
            "button",
            () => openDeleteWindow(clientId)
        );
        clientForm.appendChild(deleteModalClient);

        /* Событие клик кнопки ОБНОВИТЬ данные клиента */
        updateButton.onclick = () => {
            currentClient = 0;
            const contactInputs = Array.from(
                contactsBox.querySelectorAll("input")
            );
            const contactSelects = Array.from(
                contactsBox.querySelectorAll("select")
            );

            let contactsValid = addValidContacts(contactInputs, contactSelects);
            console.log("contactsValid: ", contactsValid);
            let isValid = contactsValid.valid;
            let contacts = contactsValid.contacts;

            if (!isValid) {
                console.log(
                    "Один или несколько контактов недействительны. Отправка на сервер отменена."
                );
                return;
            }
            hideErrors();

            let name = nameInput.value.trim();
            let surname = surnameInput.value.trim();
            let lastName = lastNameInput.value.trim();

            if (!name || !surname) {
                if (!name) {
                    errorInput(nameInput);
                }
                if (!surname) {
                    errorInput(surnameInput);
                }
                document.querySelector(".modal-error-msg").innerHTML =
                    "Заполните все обязательные поля";
                return;
            }

            let updatedData = {
                name: name,
                surname: surname,
                lastName: lastName,
                contacts: contacts,
            };

            updateClient(clientId, updatedData);
            // Закрываем модальное окно только после успешного обновления
            clientModal.style.display = "none";
            contactsBox.innerHTML = "";
            addClientBtn.disabled = false;
            document
                .querySelectorAll(".update-button-row")
                .forEach(function (btn) {
                    btn.disabled = false;
                });
        };
    }
    /* Функция добавления валидных контактов */
    function addValidContacts(inputs, selects) {
        let valid = true;
        let contacts = inputs
            .map((input, index) => {
                const select = selects[index];
                const type = select.value;
                const value = input.value.trim(); // Убедимся, что убраны лишние пробелы
                const errorElement = select.nextElementSibling; // Предполагаем, что элемент ошибки находится сразу после select

                errorElement.innerHTML = ""; // Очищаем предыдущее сообщение об ошибке

                let contactValid = true; // Флаг для отслеживания валидности текущего контакта
                if (
                    (type === "Телефон" || type === "Доп. телефон") &&
                    !isValidPhoneNumber(value)
                ) {
                    errorInput(input);
                    errorElement.innerHTML = "Неверный формат номера телефона";
                    contactValid = false;
                    valid = false;
                } else if (type === "Email" && !isValidEmail(value)) {
                    errorInput(input);
                    errorElement.innerHTML =
                        "Неверный формат электронной почты";
                    contactValid = false;
                    valid = false;
                } else if (
                    (type === "VK" || type === "Facebook") &&
                    !isValidURL(value)
                ) {
                    errorInput(input);
                    errorElement.innerHTML = "Неверный формат ссылки";
                    contactValid = false;
                    valid = false;
                }

                return contactValid ? { type, value } : null; // Возвращаем контакт, если он валиден
            })
            .filter((contact) => contact !== null); // Оставляем только валидные контакты

        console.log("Валидные контакты: ", contacts);
        return { contacts, valid };
    }
    /* Функция валидации телефона */
    function isValidPhoneNumber(phone) {
        // Пример регулярного выражения для валидации сотового номера формата +7 (123) 456-7890 или 123-456-7890
        const regex = /^(\+7\s?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
        return regex.test(phone);
    }
    /* Функция валидации email */
    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }
    /* Функция валидации url */
    function isValidURL(url) {
        const regex =
            /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/\S*)?$/;
        return regex.test(url);
    }
    /* Функция фильтра клиентов перед сортировкой */
    function filterClients(clients, sortBy, direction) {
        return clients.slice().sort((a, b) => {
            let result;
            switch (sortBy) {
                case "id":
                    result = a.id - b.id;
                    break;
                case "name":
                    result =
                        `${a.name} ${a.surname} ${a.lastName}`.localeCompare(
                            `${b.name} ${b.surname} ${b.lastName}`
                        );
                    break;
                case "createdAt":
                    result = new Date(a.createdAt) - new Date(b.createdAt);
                    break;
                case "updatedAt":
                    result = new Date(a.updatedAt) - new Date(b.updatedAt);
                    break;
            }
            return direction === "asc" ? result : -result;
        });
    }
    /* Проверка на пустое поле ввода данных контактов*/
    function updateAddContactButtonState(current, btn) {
        const contactInputs = Array.from(contactsBox.querySelectorAll("input"));
        let allInputsFilled = true;

        // Проверяем, что все поля ввода заполнены
        for (let input of contactInputs) {
            if (input.value.trim() === "") {
                allInputsFilled = false;
                break;
            }
        }

        const maxContacts = 10;
        const currentContactCount = current;

        // Устанавливаем состояние кнопки
        if (!allInputsFilled || currentContactCount >= maxContacts) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    }
    function errorInput(errInp) {
        errInp.style.borderColor = "red";
    }
    function hideErrors() {
        document.querySelectorAll("input").forEach((inp) => {
            inp.addEventListener("input", () => {
                inp.style.borderColor = "black";
                document.querySelector(".modal-error-msg").innerHTML = "";
                document
                    .querySelectorAll(".contact-error")
                    .forEach((errInp) => {
                        errInp.innerHTML = "";
                    });
            });
        });
    }
    function loadClientData() {
        // Извлекаем clientId, удаляя символ '#'
        const clientId = window.location.hash.substring(1);
        if (clientId) {
            fetchClientData(clientId);
        } else {
            console.log("clientId не задан");
        }
    }
    async function fetchClientData(clientId) {
        await fetch(`http://localhost:3000/api/clients/${clientId}`)
            .then((response) => response.json())
            .then((data) => {
                displayClientData(data);
            })
            .catch((error) =>
                console.error("Ошибка загрузки данных клиента:", error)
            );
    }
    /* Функция для отображения данных в JSON формате */
    function displayClientData(data) {
        const jsonData = JSON.stringify(data, null, 2);
        document.getElementById("clientData").textContent = jsonData;
        const dataCloseBtn = newButton(
            "Закрыть окно",
            "data-close-btn",
            "",
            () => {
                document.getElementById("clientData").style.display = "none";
            }
        );
        document.getElementById("clientData").appendChild(dataCloseBtn);
    }
    /* Функция копирования URL клиента */
    function copyUrlClient(clientLink, button) {
        document.querySelectorAll(".copy-url-btn").forEach((btn) => {
            btn.innerHTML = "Копировать URL"; // Исходный текст кнопки
        });

        navigator.clipboard
            .writeText(clientLink)
            .then(() => {
                // Изменяем текст конкретной кнопки, которая была нажата
                button.innerHTML = "Скопировано";
            })
            .catch((err) => {
                console.error("Ошибка при копировании: ", err);
                // Можно также отобразить сообщение об ошибке на кнопке
                button.innerHTML = "Ошибка копирования";
            });
    }
    /* ------FUNCTIONS--------- */

    /* ---------------EVENTS------------- */
    /* Открываем модальное окно данных клиента по гиперссылке */
    window.addEventListener("hashchange", loadClientData);
    /* Открываем модальное окно для добавления данных клиента  */
    addClientBtn.addEventListener("click", function () {
        /* Делаем другие кнопки "изменить" не активные*/
        document.querySelectorAll(".update-button-row").forEach(function (btn) {
            btn.disabled = true;
        });
        /* Делаем другие кнопки "удалить" не активные*/
        document.querySelectorAll(".delete-button-row").forEach(function (btn) {
            btn.disabled = true;
        });
        /* Кнопка "Добавить клиента" не активна */
        addClientBtn.disabled = true;
        clearContactsBox();
        updateAddContactButtonState(currentClient, addContactBtn);

        if (updateButton) {
            updateButton.remove();
        }
        if (deleteModalClient) {
            deleteModalClient.remove();
        }
        nameInput.value = "";
        surnameInput.value = "";
        lastNameInput.value = "";
        clientModal.style.display = "block";
        modalHeader.innerHTML = "Новый клиент";
        modalHeaderId.innerHTML = "";
        saveBtn.style.display = "block";
    });
    /* При нажатии на кнопку добавить контакт появляется форма добавления контакта*/
    addContactBtn.addEventListener("click", function () {
        currentClient++;
        console.log(currentClient);
        updateAddContactButtonState(currentClient, addContactBtn);
        /* Создали и добавили выпадающий список */
        const contactTypeSelect = document.createElement("select");
        contactTypes.forEach(function (contactType) {
            const option = newOption();
            option.value = contactType;
            option.text = contactType;
            contactTypeSelect.appendChild(option);
        });
        /* Создали и добавили поле для ввода контакта */
        const contactTextError = newSpan();
        contactTextError.classList.add("contact-error");
        const contactValueInput = newInput();
        contactValueInput.type = "text";
        contactValueInput.placeholder = contactPlaceholder.tel;

        console.log(currentClient);
        updateAddContactButtonState(currentClient, addContactBtn);

        /* Создали и добавили кнопку удаления контакта и блока добавления контакта */
        deleteButtonContact = newButton(
            "Удалить контакт",
            "delete-button-contact",
            "button"
        );
        deleteButtonContact.addEventListener("click", function () {
            contactDiv.remove();
            currentClient--;
            console.log(currentClient);
            updateAddContactButtonState(currentClient, addContactBtn);
        });
        /* Создали и добавили блок добавления контакта */
        const contactDiv = newDiv();
        contactDiv.appendChild(contactTypeSelect);
        contactDiv.appendChild(contactTextError);
        contactDiv.appendChild(contactValueInput);
        contactDiv.appendChild(deleteButtonContact);
        contactsBox.appendChild(contactDiv);

        updateAddContactButtonState(currentClient, addContactBtn);

        contactTypeSelect.addEventListener("change", function () {
            switch (contactTypeSelect.value) {
                case "Телефон":
                    contactValueInput.placeholder = contactPlaceholder.tel;
                    break;
                case "Доп. телефон":
                    contactValueInput.placeholder = contactPlaceholder.tel;
                    break;
                case "Email":
                    contactValueInput.placeholder = contactPlaceholder.email;
                    break;
                case "VK":
                    contactValueInput.placeholder = contactPlaceholder.site;
                    break;
                case "Facebook":
                    contactValueInput.placeholder = contactPlaceholder.site;
                    break;
                default:
                    contactValueInput.placeholder = "Введите контактные данные";
            }

            updateAddContactButtonState(currentClient, addContactBtn);
        });
    });
    /* Сохранение данных клиента */
    clientForm.addEventListener("submit", function (event) {
        /* Останавливаем стандартную перезагрузку формы */
        event.preventDefault();
        event.stopPropagation();

        hideErrors();

        let name = nameInput.value.trim();
        let surname = surnameInput.value.trim();
        let lastName = lastNameInput.value.trim();

        if (!name || !surname) {
            if (!name) {
                errorInput(nameInput);
            }
            if (!surname) {
                errorInput(surnameInput);
            }
            document.querySelector(".modal-error-msg").innerHTML =
                "Заполните все обязательные поля";
            return;
        }

        const contactInputs = Array.from(contactsBox.querySelectorAll("input"));
        const contactSelects = Array.from(
            contactsBox.querySelectorAll("select")
        );

        let isValid = true;

        const contacts = contactInputs
            .map((input, index) => {
                const select = contactSelects[index];
                const type = select.value;
                const value = input.value;
                const errorElement = select.nextElementSibling; // Предполагаем, что элемент ошибки находится сразу после select

                errorElement.innerHTML = ""; // Очищаем предыдущее сообщение об ошибке перед началом проверки

                let contactValid = true; // Флаг для отслеживания валидности текущего контакта

                if (
                    (type === "Телефон" || type === "Доп. телефон") &&
                    !isValidPhoneNumber(value)
                ) {
                    console.log("Неверный формат номера телефона:", value);
                    errorElement.innerHTML = "Неверный формат номера телефона";
                    contactValid = false;
                    isValid = false;
                }

                if (type === "Email" && !isValidEmail(value)) {
                    console.log("Неверный формат электронной почты:", value);
                    errorElement.innerHTML =
                        "Неверный формат электронной почты";
                    contactValid = false;
                    isValid = false;
                }

                if (
                    (type === "VK" || type === "Facebook") &&
                    !isValidURL(value)
                ) {
                    console.log("Неверный формат ссылки:", value);
                    errorElement.innerHTML = "Неверный формат ссылки";
                    contactValid = false;
                    isValid = false;
                }

                if (contactValid) {
                    return { type, value }; // Возвращаем контакт, если он валиден
                } else {
                    return null; // Возвращаем null, если контакт невалиден
                }
            })
            .filter((contact) => contact); // Оставляем только валидные контакты

        if (!isValid) {
            console.log(
                "Один или несколько контактов недействительны. Отправка на сервер отменена."
            );
            return;
        }

        const client = {
            name: name,
            surname: surname,
            lastName: lastName,
            contacts: contacts,
        };

        addClient(client);
        clientModal.style.display = "none";
        /* Кнопка "Добавить клиента" активна */
        addClientBtn.disabled = false;
    });
    /* Закрываем модальное окно для добавления данных клиента  */
    closeBtn.addEventListener("click", function () {
        hideErrors();
        clearContactsBox();
        updateAddContactButtonState(currentClient, addContactBtn);
        /* Кнопка "Добавить клиента" активна */
        addClientBtn.disabled = false;
        currentClient = 0;

        /* Делаем другие кнопки "изменить" активные*/
        document.querySelectorAll(".update-button-row").forEach(function (btn) {
            btn.disabled = false;
        });
        /* Делаем другие кнопки "удалить" активные*/
        document.querySelectorAll(".delete-button-row").forEach(function (btn) {
            btn.disabled = false;
        });

        document.getElementById("client-modal").style.display = "none";
    });
    contactsBox.addEventListener("input", function () {
        updateAddContactButtonState(currentClient, addContactBtn);
    });
    /* Сортировка клиентов при нажатии на заголовки таблицы */
    document.querySelectorAll("#client-table th").forEach((th) => {
        th.addEventListener("click", function () {
            const sortBy = th.getAttribute("data-sort");
            const currentDirection = th.getAttribute("data-sort-direction");
            const newDirection = currentDirection === "asc" ? "desc" : "asc";
            th.setAttribute("data-sort-direction", newDirection);
            const sortedClients = filterClients(clients, sortBy, newDirection);

            renderClientsTable(sortedClients);
        });
    });
    document.addEventListener("DOMContentLoaded", function () {
        /* Запуск отрисовки клиентов */
        openListClients();
        /* вызываем эту функцию при инициализации страницы, чтобы убедиться, что состояние кнопки правильное */
        updateAddContactButtonState(currentClient, addContactBtn);
        /* Реализация поиска по имени и фамилии */
        document
            .getElementById("search-input")
            .addEventListener("input", function () {
                clearTimeout(this.searchTimer); // Очищаем текущий таймер при новом вводе
                this.searchTimer = setTimeout(() => {
                    // Устанавливаем новый таймер
                    let input = this.value.toLowerCase();
                    let table = document.getElementById("client-table");
                    let rows = table.getElementsByTagName("tr");

                    for (let i = 1; i < rows.length; i++) {
                        let idCell = rows[i].getElementsByTagName("td")[0];
                        let nameCell = rows[i].getElementsByTagName("td")[1];

                        if (idCell && nameCell) {
                            let idText = idCell.textContent || idCell.innerText;
                            let nameText =
                                nameCell.textContent || nameCell.innerText;

                            if (
                                idText.toLowerCase().indexOf(input) > -1 ||
                                nameText.toLowerCase().indexOf(input) > -1
                            ) {
                                rows[i].style.display = "";
                            } else {
                                rows[i].style.display = "none";
                            }
                        }
                    }
                }, 300); // Задержка в 300 мс
            });
    });
    /* ---------------EVENTS------------- */
})();
