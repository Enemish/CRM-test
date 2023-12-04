/* Задачи:
2 Сделать пример в плейсхолдере заполнения контакта
3 Сделать ограничение на количество контактов (не больше 10)
4 Добавить кнопку удаления клиента в окне изменения контакта
5 Попробовать сделать ссылку на карточку клиента через hash часть
  */


(function () {

  /* Ссылка на элемент tbody таблицы */
  const tableElement = document.getElementById('client-table').querySelector('tbody');
  const clientForm = document.getElementById('client-form');
  const nameInput = document.getElementById('name-input');
  const surnameInput = document.getElementById('surname-input');
  const lastNameInput = document.getElementById('last-name-input');
  const contactsBox = document.getElementById('contacts');
  const closeBtn = document.getElementById('close-modal-button');
  const saveBtn = document.getElementById('save-contact-button');
  const addContactBtn = document.getElementById('add-contact-button');
  const clientModal = document.getElementById('client-modal');
  let updateButton;
  /* Пустой массив клиентов */
  let clients = [];
  /* Массив выпадающего списка контактов */
  const contactTypes = ['Телефон', 'Доп. телефон', 'Email', 'VK', 'Facebook', 'Другое'];


/* ------FUNCTIONS---------*/
  /* Загружаем список студентов с сервера */
  async function openListClients() {
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
    clients = data;

    renderClientsTable(clients);
    console.log(clients);

  }
  /* Добавление клиента в базу данных */
  async function addClient(client) {
    await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(client)
    })
    openListClients();
    clientForm.reset();
  }
   /* Удаление клиента с сервера */
  async function deleteClient(clientId) {
    await fetch(`http://localhost:3000/api/clients/${clientId}`, {
      method: 'DELETE',
    });
    openListClients();
  }
   /* Обновлений данных о клиенте на сервере */
  async function updateClient(clientId, updatedData) {
    await fetch(`http://localhost:3000/api/clients/${clientId}`, {
      method: 'PATCH', // Указываем метод запроса
      headers: {
        'Content-Type': 'application/json', // Указываем тип содержимого в теле запроса
      },
      body: JSON.stringify(updatedData), // Конвертируем JavaScript-объект в строку JSON
    })
    console.log(updatedData);
    openListClients();
    clientForm.reset();
  }
  /* функция первой заглавной буквы в ФИО */
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
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return day + "." + month + "." + year + " " + hours + ":" + minutes;

  }
  /* Функция очистки контактных данных после обновления или закрытия формы */
  function clearContactsBox() {
    while (contactsBox.firstChild) {
        contactsBox.removeChild(contactsBox.firstChild);
    }
  }
  /* Отрисовка массива clients[] */
  function renderClientsTable(clients) {
    /* Получаем ссылку на тело таблицы */
    let tableBody = document.querySelector('#client-table tbody');
    /* Очищаем содержимое тела таблицы */
    tableBody.innerHTML = '';

    /* Перебираем каждого студента в массиве и создаем строку таблицы для каждого студента */
    clients.forEach(function(client) {
      // Создаем новую строку таблицы
      let row = document.createElement('tr');

      /* ID Клиента */
      let clientId = client.id;
      let clientIdCell = document.createElement('td');
      clientIdCell.textContent = Number(clientId);
      row.appendChild(clientIdCell);

      /* ФИО Клиента */
      let fullName = capitalizeFirstLetter(client.name) + " " + capitalizeFirstLetter(client.surname) + " " + capitalizeFirstLetter(client.lastName);
      let fullNameCell = document.createElement('td');
      fullNameCell.textContent = fullName;
      row.appendChild(fullNameCell);

      /* Дата и время создания */
      let createdAt = new Date(client.createdAt);
      let createdAtCell = document.createElement('td');
      createdAtCell.textContent = formatDate(createdAt);
      row.appendChild(createdAtCell);

      /* Дата и время Обновления */
      let updatedAt = new Date(client.updatedAt);
      let updatedAtCell = document.createElement('td');
      updatedAtCell.textContent = formatDate(updatedAt);
      row.appendChild(updatedAtCell);

      /* Контакты клиента  (Сделать иконочное отображение типов контакта)*/
      let clientContacts = client.contacts;
      let clientContactCell = document.createElement('td');
      let contactList = document.createElement('ul');
      contactList.className = 'contact-tbl';
      for (let contact of clientContacts) {
        let type = contact.type;
        let value = contact.value;

        let contactItem = document.createElement('li');
        contactItem.className = 'contact-item';
        contactItem.tabIndex = 0;

        let iconElement = document.createElement('i');

        switch (type) {
          case 'Телефон':
              iconElement.className = 'contact-icon contact-icon-phone';
              break;
          case 'Доп. телефон':
              iconElement.className = 'contact-icon contact-icon-add-phone';
              break;
          case 'Email':
              iconElement.className = 'contact-icon contact-icon-email';
              break;
          case 'VK':
              iconElement.className = 'contact-icon contact-icon-vk';
              break;
          case 'Facebook':
              iconElement.className = 'contact-icon contact-icon-facebook';
              break;
          case 'Другое':
              iconElement.className = 'contact-icon contact-icon-other ';
              break;
          /* default:
              // Если у нас нет иконки для этого типа контакта, можно просто использовать текстовое значение типа
              iconElement.textContent = type;
              break; */
          }
          let valueContainer = document.createElement('span');
          valueContainer.className = 'contact-value';
          valueContainer.textContent = type + ":" + value;


          contactItem.appendChild(iconElement);
          contactItem.appendChild(valueContainer);
          contactList.appendChild(contactItem);
      }

      clientContactCell.appendChild(contactList);
      row.appendChild(clientContactCell);

      /* Действия (изменение, удаление) */
      let actionsCell = document.createElement('td');

      /* Создаем кнопку изменения в строке */
      let updateButtonRow = document.createElement('button');
      updateButtonRow.textContent = "Изменить";
      updateButtonRow.classList.add("update-button");


      /* открытие модального окна изменений данных клиента ----------------------------------------------- */
      updateButtonRow.addEventListener('click', function() {
        clearContactsBox();
        /* Делаем другие кнопки "изменить" не активные*/
        document.querySelectorAll('.update-button').forEach(function(btn){
          btn.disabled = true;
        });
        /* Делаем другие кнопки "удалить" не активные*/
        document.querySelectorAll('.delete-button').forEach(function(btn){
          btn.disabled = true;
        });

        if(updateButton){
          updateButton.remove();
        }

        /* Открываем модальное окно */
        clientModal.style.display = 'block';

        document.getElementById('name-input').value = capitalizeFirstLetter(client.name);
        document.getElementById('surname-input').value = capitalizeFirstLetter(client.surname);
        document.getElementById('last-name-input').value = capitalizeFirstLetter(client.lastName);

        /* Отображаем типы контактов и сами контакты клиента если они есть */
        if (clientContacts && clientContacts.length > 0) {
          for (let contact of clientContacts) {
            const contactDiv = document.createElement('div');
            const contactTextError = document.createElement('span');
            contactTextError.classList.add('contact-error');
            const contactUpSelect = document.createElement('select');
            const contactUpInput = document.createElement('input');
            contactUpInput.value = contact.value;

            /* Создали и добавили кнопку удаления контакта и блока добавления контакта */
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Удалить контакт';
            deleteButton.addEventListener('click', function() {
              contactDiv.remove();
              updateAddContactButtonState();
            });

            /* Итерация по всем возможным типам контактов */
            for (let contactType of contactTypes) {
              const option = document.createElement('option');
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
              contactDiv.appendChild(deleteButton);
              contactsBox.appendChild(contactDiv);
          }
        } else {
          // Удаление всех блоков контактов
          clearContactsBox();
        }


        /* Селект и инпут с новой строки */

        /* Убираем кнопку сохранить */
        document.getElementById('save-contact-button').style.display = 'none';

        /* Создаем кнопку Обновить */
        updateButton = document.createElement('button');
        updateButton.type = 'button';
        updateButton.textContent = "Обновить";
        document.getElementById('client-form').appendChild(updateButton);

        /* Событие клик кнопки ОБНОВИТЬ данные клиента */
        updateButton.addEventListener('click', function(){

          document.querySelectorAll('.update-button').forEach(function(btn){
            btn.disabled = false;
          });
          const contactInputs = Array.from(contactsBox.querySelectorAll('input'));
          const contactSelects = Array.from(contactsBox.querySelectorAll('select'));

          let isValid = true;

          const contacts = contactInputs.map((input, index) => {
            const select = contactSelects[index];
            const type = select.value;
            const value = input.value;
            const errorElement = select.nextElementSibling; // Предполагаем, что элемент ошибки находится сразу после select

            errorElement.innerHTML = ''; // Очищаем предыдущее сообщение об ошибке перед началом проверки

            let contactValid = true; // Флаг для отслеживания валидности текущего контакта

            if ((type === 'Телефон' || type === 'Доп. телефон') && !isValidPhoneNumber(value)) {
              console.log('Неверный формат номера телефона:', value);
              errorElement.innerHTML = 'Неверный формат номера телефона';
              contactValid = false;
              isValid = false;
            }

            if (type === 'Email' && !isValidEmail(value)) {
              console.log('Неверный формат электронной почты:', value);
              errorElement.innerHTML = 'Неверный формат электронной почты';
              contactValid = false;
              isValid = false;
            }

            if ((type === 'VK' || type === 'Facebook') && !isValidURL(value)) {
              console.log('Неверный формат ссылки:', value);
              errorElement.innerHTML = 'Неверный формат ссылки';
              contactValid = false;
              isValid = false;
            }

            if (contactValid) {
              return { type, value }; // Возвращаем контакт, если он валиден
            } else {
              return null; // Возвращаем null, если контакт невалиден
            }
          }).filter(contact => contact); // Оставляем только валидные контакты

          if (!isValid) {
            console.log("Один или несколько контактов недействительны. Отправка на сервер отменена.");
            return;
          }

          let name = document.getElementById('name-input').value.trim();
          let surname = document.getElementById('surname-input').value.trim();
          let lastName = document.getElementById('last-name-input').value.trim();


          if (!name || !surname || !lastName) {
            alert('Пожалуйста, заполните все поля: имя, фамилия и отчество.');
            return;
          } else {
            let updatedData = {
              name: name,
              surname: surname,
              lastName: lastName,
              contacts: contacts
            }
            updateClient(clientId, updatedData);
            clientModal.style.display = 'none';
            contactsBox.removeChild;
          }
        })
      });
      actionsCell.appendChild(updateButtonRow);
      /* открытие модального окна изменений данных клиента (конец) ---------------------------------- */


      /* Создаем кнопку удаления */
      let deleteButton = document.createElement('button');
      deleteButton.textContent = "Удалить";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите удалить этого клиента?')) {
          deleteClient(clientId);
        }
      });
      actionsCell.appendChild(deleteButton);

      /* Добавляем ячейку действий в строку */
      row.appendChild(actionsCell);

      /* Добавляем строку в тело таблицы */
      tableBody.appendChild(row);
    });
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
    const regex = /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/\S*)?$/;
    return regex.test(url);
  }
  /* Функция фильтра клиентов перед сортировкой */
  function filterClients(clients, sortBy, direction) {
    return clients.slice().sort((a, b) => {
      let result;
      switch (sortBy) {
        case 'id':
          result = a.id - b.id;
          break;
        case 'name':
          result = `${a.name} ${a.surname} ${a.lastName}`.localeCompare(`${b.name} ${b.surname} ${b.lastName}`);
          break;
        case 'createdAt':
          result = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'updatedAt':
          result = new Date(a.updatedAt) - new Date(b.updatedAt);
          break;
      }
      return direction === 'asc' ? result : -result;
    });
  }
  /* Проверка на пустое поле ввода данных */
  function updateAddContactButtonState() {
    const contactInputs = Array.from(contactsBox.querySelectorAll('input'));
    /* если нет ни одного контакта или все поля ввода заполнены, активируем кнопку */
    const allInputsFilled = contactInputs.length === 0 || contactInputs.every(input => input.value.trim() !== '');
    addContactBtn.disabled = !allInputsFilled;
  }
  /* ------FUNCTIONS--------- */

  /* Открываем модальное окно для добавления данных клиента  */
  document.getElementById('add-client-button').addEventListener('click', function() {
    clearContactsBox();
    updateAddContactButtonState();

    if(updateButton){
      updateButton.remove();
    }
    document.getElementById('name-input').value = '';
    document.getElementById('surname-input').value = '';
    document.getElementById('last-name-input').value = '';
    clientModal.style.display = 'block';
    document.getElementById('save-contact-button').style.display = 'block';
  });
  /* При нажатии на кнопку добавить контакт появляется форма добавления контакта*/
  addContactBtn.addEventListener('click', function() {

    /* Создали и добавили выпадающий список */
    const contactTypeSelect = document.createElement('select');
    contactTypes.forEach(function(contactType) {
      const option = document.createElement('option');
      option.value = contactType;
      option.text = contactType;
      contactTypeSelect.appendChild(option);
    });
    /* Создали и добавили поле для ввода контакта */
    const contactTextError = document.createElement('span');
    contactTextError.classList.add('contact-error');
    const contactValueInput = document.createElement('input');
    contactValueInput.type = 'text';
    contactValueInput.placeholder = 'Введите контактные данные...';
    /* Создали и добавили кнопку удаления контакта и блока добавления контакта */
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Удалить контакт';
    deleteButton.addEventListener('click', function() {
      contactDiv.remove();
      updateAddContactButtonState();
    });
    /* Создали и добавили блок добавления контакта */
    const contactDiv = document.createElement('div');
    contactDiv.appendChild(contactTypeSelect);
    contactDiv.appendChild(contactTextError);
    contactDiv.appendChild(contactValueInput);
    contactDiv.appendChild(deleteButton);
    contactsBox.appendChild(contactDiv);

    updateAddContactButtonState();
  });
  /* Сохранение данных клиента */
  clientForm.addEventListener("submit", function(event) {
    /* Останавливаем стандартную перезагрузку формы */
    event.preventDefault();
    event.stopPropagation();

    const contactInputs = Array.from(contactsBox.querySelectorAll('input'));
    const contactSelects = Array.from(contactsBox.querySelectorAll('select'));

    let isValid = true;

    const contacts = contactInputs.map((input, index) => {
      const select = contactSelects[index];
      const type = select.value;
      const value = input.value;
      const errorElement = select.nextElementSibling; // Предполагаем, что элемент ошибки находится сразу после select

      errorElement.innerHTML = ''; // Очищаем предыдущее сообщение об ошибке перед началом проверки

      let contactValid = true; // Флаг для отслеживания валидности текущего контакта

      if ((type === 'Телефон' || type === 'Доп. телефон') && !isValidPhoneNumber(value)) {
        console.log('Неверный формат номера телефона:', value);
        errorElement.innerHTML = 'Неверный формат номера телефона';
        contactValid = false;
        isValid = false;
      }

      if (type === 'Email' && !isValidEmail(value)) {
        console.log('Неверный формат электронной почты:', value);
        errorElement.innerHTML = 'Неверный формат электронной почты';
        contactValid = false;
        isValid = false;
      }

      if ((type === 'VK' || type === 'Facebook') && !isValidURL(value)) {
        console.log('Неверный формат ссылки:', value);
        errorElement.innerHTML = 'Неверный формат ссылки';
        contactValid = false;
        isValid = false;
      }

      if (contactValid) {
        return { type, value }; // Возвращаем контакт, если он валиден
      } else {
        return null; // Возвращаем null, если контакт невалиден
      }
    }).filter(contact => contact); // Оставляем только валидные контакты

    if (!isValid) {
      console.log("Один или несколько контактов недействительны. Отправка на сервер отменена.");
      return;
    }

    const client = {
      name: nameInput.value,
      surname: surnameInput.value,
      lastName: lastNameInput.value,
      contacts: contacts
    };

    addClient(client);
    clientModal.style.display = 'none';
  });
  /* Закрываем модальное окно для добавления данных клиента  */
  closeBtn.addEventListener('click', function() {
    clearContactsBox();
    updateAddContactButtonState();

    /* Делаем другие кнопки "изменить" не активные*/
    document.querySelectorAll('.update-button').forEach(function(btn){
      btn.disabled = false;
    });
    /* Делаем другие кнопки "удалить" не активные*/
    document.querySelectorAll('.delete-button').forEach(function(btn){
      btn.disabled = false;
    });

    document.getElementById('client-modal').style.display = 'none';
  });
  contactsBox.addEventListener('input', updateAddContactButtonState);
  /* Сортировка клиентов при нажатии на заголовки таблицы */
  document.querySelectorAll('#client-table th').forEach(th => {
    th.addEventListener('click', function() {

      const sortBy = th.getAttribute('data-sort');
      const currentDirection = th.getAttribute('data-sort-direction');
      const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
      th.setAttribute('data-sort-direction', newDirection);
      const sortedClients = filterClients(clients, sortBy, newDirection);

      renderClientsTable(sortedClients);
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    /* Запуск отрисовки клиентов */
    openListClients();
    /* вызываем эту функцию при инициализации страницы, чтобы убедиться, что состояние кнопки правильное */
    updateAddContactButtonState();
    /* Реализация поиска по имени и фамилии */
    document.getElementById('search-input').addEventListener('input', function() {
      let input = this.value.toLowerCase();
      let table = document.getElementById('client-table');
      let rows = table.getElementsByTagName('tr');

      for (let i = 1; i < rows.length; i++) {
        let idCell = rows[i].getElementsByTagName('td')[0];
        let nameCell = rows[i].getElementsByTagName('td')[1];

        if (idCell && nameCell) {
          let idText = idCell.textContent || idCell.innerText;
          let nameText = nameCell.textContent || nameCell.innerText;

          if (idText.toLowerCase().indexOf(input) > -1 || nameText.toLowerCase().indexOf(input) > -1) {
            rows[i].style.display = "";
          } else {
            rows[i].style.display = "none";
          }
        }
      }
    });
  });
})();
