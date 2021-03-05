'use strict';
//Определение функции filterByType c аргументами type и values.
//Аргумент values через спред оператор преобразовывается в массив и фильтруется по типу переданному через аргумент type 
const filterByType = (type, ...values) => values.filter(value => typeof value === type),
  //Определение функции hideAllResponseBlocks
  hideAllResponseBlocks = () => {
    //Получение всех элементов с классом .dialog__response-block в виде массива в переменную responseBlocksArray
    const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
    //Перебор элементов в цикле forEach и присвоение им стиля display: none
    responseBlocksArray.forEach(block => block.style.display = 'none');
  },
  //Определение функции showResponseBlock c blockSelector, msgText и spanSelector
  showResponseBlock = (blockSelector, msgText, spanSelector) => {
    //Вызов функции hideAllResponseBlocks
    hideAllResponseBlocks();
    //Получение элемента по селектору преданному в аргументе blockSelector и присвоение ему стиля display: block
    document.querySelector(blockSelector).style.display = 'block';
    //Определение передан ли аргумент spanSelector
    if (spanSelector) {
      //Если аргумент spanSelector передан получение элемента по селектору преданному в аргументе spanSelector
      //и присвоение ему значения переданному в аргументе msgText 
      document.querySelector(spanSelector).textContent = msgText;
    }
  },
  //Определение функции showError с аргументом msgText и вызов функции showResponseBlock по переданным аргументам
  showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),
  //Определение функции showResults с аргументом msgText и вызов функции showResponseBlock по переданным аргументам
  showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),
  //Определение функции showNoResults и вызов функции showResponseBlock по переданному аргументу
  showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),
  //Определение функции tryFilterByType c аргументами type и values.
  tryFilterByType = (type, values) => {
    //Начало блока try
    try {
      //Вызов функции filterByType c аргументами type и values через eval, объедение массивоподобного объекта в строку
      //через разделитель запятая с пробелом и запись в переменную valuesArray
      const valuesArray = eval(`filterByType('${type}', ${values})`).join(", "); //jshint ignore:line
      //Создание в переменной alertMsg, определение длинны строки valuesArray
      const alertMsg = (valuesArray.length) ?
        //Запись в переменную alertMsg результат выполнения valuesArray если тернарный оператор вернул true
        `Данные с типом ${type}: ${valuesArray}` :
        //Запись в переменную alertMsg результат выполнения valuesArray если тернарный оператор вернул false
        `Отсутствуют данные типа ${type}`;
      //Вызов функции showResults с аргументом alertMsg
      showResults(alertMsg);
      //Начало блока catch
    } catch (e) {
      //Если в блоке try произошла ошибка вызов функции showError с сообщением об ошибке
      showError(`Ошибка: ${e}`);
    }
  };
//Получение элемента с айди filter-btn и запись в переменную filterButton 
const filterButton = document.querySelector('#filter-btn');
//Навешивание слушателя элемент полученный в переменную filterButton
filterButton.addEventListener('click', e => {
  //Получение элемента с айди type и запись в переменную typeInput
  const typeInput = document.querySelector('#type');
  //Получение элемента с айди data и запись в переменную dataInput
  const dataInput = document.querySelector('#data');
  //Определяем пустой ли dataInput
  if (dataInput.value === '') {
    //Если dataInput пустой сообщаем об ошибке в подсказке со своим текстом через функцию setCustomValidity
    dataInput.setCustomValidity('Поле не должно быть пустым!');
    //Вызов функции showNoResults
    showNoResults();
    //Если dataInput не пуст
  } else {
    //Убираем сообщение об ошибке в подсказке функцию setCustomValidity
    dataInput.setCustomValidity('');
    //Отменяем действие по умолчанию
    e.preventDefault();
    //Вызываем функцию tryFilterByType с аргументами из typeInput и dataInput убрав пробелы через функцию trim
    tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
  }
});
