const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('test.db');

// Замените 'YOUR_BOT_TOKEN' на токен вашего бота
const token = '6447749038:AAHOytS7uNKJZAjMsJRZW7KT-ev47dh50u4';
const bot = new TelegramBot(token, { polling: true });

const channelUsername = '-1002137528444'; // Замените на юзернейм вашего канала

bot.onText(/\/start/, (msg) => {
  
    const chatId = msg.chat.id;
    const userName = msg.from.username;
    bot.sendMessage(chatId, 'Вас вітає AcornTrafficBot! Оберіть один з варінтів:', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Офери', callback_data: 'offers' },
              { text: 'Оплата', callback_data: 'payment' }
            ], 
            [
              { text: 'Статистика', callback_data: 'statistics' },
              { text: 'Інформація', callback_data: 'info' }
            ],
            [
              { text: 'Партнерство', callback_data: 'partnership' }
            ],
            
          ]
        }
      });
    });

    bot.on('callback_query', (query) => {
        const userName = query.from.username;
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id; // Отримання ID повідомлення
        const data = query.data;


        // ІНФОРМАЦІЯ


        switch (data) {
          // ... (інші варіанти обробки)
          case 'info':
            bot.editMessageText('Знайдіть потрібну інформацію тут:', {
              chat_id: chatId,
              message_id: messageId,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: 'Наш канал', callback_data: 'channel', url: 'https://t.me/+JP0QYpl8ZV5lNjFi'}
                  ],
                  [
                    { text: 'Аккаунти', callback_data: 'account_info', url: 'https://telegra.ph/POKROKOVA-%D0%86NSTRUKC%D0%86YA-PO-ARB%D0%86TRAZHU-12-02' },
                    { text: 'Креативи', callback_data: 'art_info', url: 'https://telegra.ph/POKROKOVA-%D0%86NSTRUKC%D0%86YA-PO-ARB%D0%86TRAZHU-12-02-2' },
                    { text: 'Оплата', callback_data: 'payment_info', url: 'https://telegra.ph/POKROKOVA-%D0%86NSTRUKC%D0%86YA-PO-ARB%D0%86TRAZHU-12-02-3'},
                  ],
                  // [
                  //   { text: 'Звуки', callback_data: 'video_sound', url: 'https://t.me/+pHRrstGRXj5mMTUy'},
                  //   { text: 'Фото', callback_data: 'video_photo', url: 'https://t.me/+ByIu3MW9ZQ82NDFi'}
                  // ],
                  [
                    
                    { text: 'Наш чат', callback_data: 'chat', url: 'https://t.me/+-dElghLWneM0YWJi'}
                  ],
                  [
                    { text: 'Назад', callback_data: 'back1' }
                  ]
                ]
              }
            });
              break;
          // ... (інші варіанти обробки)
          default:
              // решта вашого коду для обробки інших випадків
              break;
      }


      // ОПЛАТА

      switch (data) {
        // ... (інші варіанти обробки)
        case 'payment':
            showPaymentOptions(chatId, messageId, userName, bot);
            break;
        // ... (інші варіанти обробки)
        default:
            // решта вашого коду для обробки інших випадків
            break;
    }
  

    function showPaymentOptions(chatId, messageId, userName, bot) {
      db.get(`SELECT * FROM payment WHERE username = ?`, [userName], (err, row) => {
          if (err) {
              console.error(err.message);
              bot.editMessageText('Помилка при отриманні даних про оплату', {
                  chat_id: chatId,
                  message_id: messageId
              });
              return;
          }
  
          if (row && row.card_number) {
              const userCardNumber = row.card_number;
              bot.editMessageText(`Оплата здійснюється на monobank, Visa/Mastercard(UAH). Ваша прив'язана картка: ${userCardNumber}`, {
                  chat_id: chatId,
                  message_id: messageId,
                  reply_markup: {
                      inline_keyboard: [
                          [
                              { text: 'Оновити карту для оплати', callback_data: 'update_payment' }
                          ],
                          [
                              { text: 'Назад', callback_data: 'back1' }
                          ]
                      ]
                  }
              });
          } else {
              bot.editMessageText(`Оплата здійснюється на monobank, Visa/Mastercard(UAH). Прив'яжіть карту`, {
                  chat_id: chatId,
                  message_id: messageId,
                  reply_markup: {
                      inline_keyboard: [
                          [
                              { text: 'Додати карту для оплати', callback_data: 'add_payment' }
                          ],
                          [
                              { text: 'Назад', callback_data: 'back1' }
                          ]
                      ]
                  }
              });
          }
      });
  }
  



  switch (data) {
      // ... (інші варіанти обробки)
      case 'add_payment':
          bot.sendMessage(chatId, `Будь ласка, введіть номер вашої картки, щоб додати:`);
          bot.once('message', (msg) => {
              const cardNumber = msg.text;
              savePaymentInfo(userName, cardNumber, chatId, bot);
          });
          break;
      case 'update_payment':
          bot.sendMessage(chatId, `Будь ласка, введіть новий номер вашої картки, щоб оновити:`);
          bot.once('message', (msg) => {
              const newCardNumber = msg.text;
              updatePaymentInfo(userName, newCardNumber, chatId, bot);
          });
          break;
      // ... (інші варіанти обробки)
  }


function savePaymentInfo(userName, cardNumber, chatId, bot) {
  // Перевірка, чи існує вже запис з таким користувачем
  db.get(`SELECT * FROM payment WHERE username = ?`, [userName], (err, row) => {
      if (err) {
          console.error(err.message);
          bot.sendMessage(chatId, 'Помилка при збереженні номеру картки', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                      { text: 'Назад', callback_data: 'payment' }
                    ]
                ]
            }
        });
          return;
      }
      if (row) {
          const userCardNumber = row.card_number;
          bot.sendMessage(chatId, `Ви вже маєте підв'язану картку: ${userCardNumber}! Щоб оновити - перейдіть`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Оновити карту для оплати', callback_data: 'update_payment' }
                    ]
                ]
            }
        });
      } else {
          db.run(`INSERT INTO payment(username, card_number) VALUES(?, ?)`, [userName, cardNumber], (err) => {
              if (err) {
                  console.error(err.message);
                  bot.sendMessage(chatId, 'Помилка при збереженні номеру картки', {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [
                              { text: 'Назад', callback_data: 'payment' }
                            ]
                        ]
                    }
                });
                  return;
              }
              bot.sendMessage(chatId, `Номер картки успішно додано: ${cardNumber}`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                          { text: 'Назад', callback_data: 'payment' }
                        ]
                    ]
                }
            });
          });
      }
  });
}

function updatePaymentInfo(userName, newCardNumber, chatId, bot) {
  db.get(`SELECT * FROM payment WHERE username = ?`, [userName], (err, row) => {
      if (err) {
          console.error(err.message);
          bot.sendMessage(chatId, 'Помилка при оновленні номеру картки', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                      { text: 'Назад', callback_data: 'payment' }
                    ]
                ]
            }
        });
          return;
      }
      if (!row) {
          bot.sendMessage(chatId, 'Ви ще не додали жодну картку, щоб додати перейдіть', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Додати карту для оплати', callback_data: 'add_payment' }
                    ]
                ]
            }
        });
      } else {
          db.run(`UPDATE payment SET card_number = ? WHERE username = ?`, [newCardNumber, userName], (err) => {
              if (err) {
                  console.error(err.message);
                  bot.sendMessage(chatId, 'Помилка при оновленні номеру картки', {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [
                              { text: 'Назад', callback_data: 'payment' }
                            ]
                        ]
                    }
                });
                  return;
              }
              bot.sendMessage(chatId, `Номер картки користувача успішно оновлено на: ${newCardNumber}`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                          { text: 'Назад', callback_data: 'payment' }
                        ]
                    ]
                }
            });
          });
      }
  });
}




      // СТАТИСТИКА

      switch (data) {
        case 'statistics':
          bot.editMessageText('Оберіть офер для перегляду його статистики:', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'TEST', callback_data: 'test_1' },
                  { text: 'TEST2', callback_data: 'test_2' },
                ],
                [
                  { text: 'Назад', callback_data: 'back1' }
                ]
              ]
            }
          });
          break;


          // TEST1
          case 'test_1':
            getLinkForUser(userName, bot, chatId, messageId);
            break;

          // TEST2

            case 'test_2':
            getLinkForUser1(userName, bot, chatId, messageId);
            break;
          }

          
          // TEST1
          function getLinkForUser(userName, bot, chatId, messageId) {
            db.get(`SELECT test1 FROM user WHERE username = ?`, [userName], (err, row) => {
                if (err) {
                    console.error(err.message);
                    bot.sendMessage(chatId, 'Помилка при отриманні посилання');
                    return;
                }
                if (row && row.test1) {
                    const userLink = row.test1;
                    bot.sendMessage(chatId, `Посилання: ${userLink}`, {
                      reply_markup: {
                          inline_keyboard: [
                              [{ text: 'Назад', callback_data: 'statistics' }]
                          ]
                      }
                  });
                } else {
                    bot.sendMessage(chatId, `Посилання для користувача ${userName} відсутнє`);
                }
            });
            
        }
        // TEST2
        function getLinkForUser1(userName, bot, chatId, messageId) {
          db.get(`SELECT test1 FROM user1 WHERE username = ?`, [userName], (err, row) => {
              if (err) {
                  console.error(err.message);
                  bot.sendMessage(chatId, 'Помилка при отриманні посилання');
                  return;
              }
              if (row && row.test1) {
                  const userLink = row.test1;
                  bot.sendMessage(chatId, `Посилання: ${userLink}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Назад', callback_data: 'statistics' }]
                        ]
                    }
                });
              } else {
                  bot.sendMessage(chatId, `Посилання для користувача ${userName} відсутнє`);
              }
          });
          
      }


      



      // ОФЕРИ
      
        switch (data) {
          case 'offers':
            bot.editMessageText('Оберіть офер, який бажаєте:', {
              chat_id: chatId,
              message_id: messageId,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: 'TEST', callback_data: 'test1' },
                    { text: 'TEST2', callback_data: 'test2' },
                  ],
                  [
                    { text: 'Назад', callback_data: 'back1' }
                  ]
                ]
              }
            });
            break;
      

            case 'back1':
        bot.editMessageText('Вас вітає AcornTrafficBot! Оберіть один з варінтів:', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [
                { text: 'Офери', callback_data: 'offers' },
                { text: 'Оплата', callback_data: 'payment' }
              ], 
              [
                { text: 'Статистика', callback_data: 'statistics' },
                { text: 'Інформація', callback_data: 'info' }
              ],
              [
                { text: 'Партнерство', callback_data: 'partnership' }
              ],
          ]
        }
      });
      break;


          case 'test1':
            bot.editMessageText('Згенеруй посилання для цього оферу:', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: 'Генерувати', callback_data: 'link1' }
                    ],
                    [
                      { text: 'Назад', callback_data: 'offers' }
                    ]
                  ]
                }
              });
            break;
      
            case 'test2':
              bot.editMessageText('Згенеруй посилання для цього оферу:', {
                  chat_id: chatId,
                  message_id: messageId,
                  reply_markup: {
                    inline_keyboard: [
                      [
                        { text: 'Генерувати', callback_data: 'link2' }
                      ],
                      [
                        { text: 'Назад', callback_data: 'offers' }
                      ]
                    ]
                  }
                });
              break;
                }
    
              
                // TEST1
                switch (data) {
                  case 'link1':
                    checkLinkExistence(userName, bot, chatId, messageId);
                    break;
                }
                
                function checkLinkExistence(userName, bot, chatId, messageId) {
                  db.get(`SELECT * FROM user WHERE username = ?`, [userName], (err, row) => {
                    if (err) {
                      console.error(err.message);
                      bot.sendMessage(chatId, 'Помилка при перевірці посилання');
                      return;
                    }
                    if (row && row.test1) {
                      bot.sendMessage(chatId, 'Посилання вже створено!');
                    } else {
                      generateLink(chatId, messageId, userName, bot);
                    }
                  });
                }
                
                function checkLinkExistence(userName, bot, chatId, messageId) {
                  db.get(`SELECT * FROM user WHERE username = ?`, [userName], (err, row) => {
                      if (err) {
                          console.error(err.message);
                          bot.sendMessage(chatId, 'Помилка при перевірці посилання');
                          return;
                      }
                      if (row && row.test1) {
                          bot.sendMessage(chatId, 'Посилання вже створено! Перегляньте його в статистиці', {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: 'Назад', callback_data: 'offers' }]
                                ]
                            }
                        });
                      } else {
                          generateLink(chatId, messageId, userName, bot);
                      }
                  });
              }
              
              function generateLink(chatId, messageId, userName, bot) {
                  bot.createChatInviteLink(channelUsername, { name: userName }).then((inviteLink) => {
                      const generatedLink = inviteLink.invite_link;
                      db.run(`INSERT INTO user(username, test1) VALUES(?, ?)`, [userName, generatedLink], (err) => {
                          if (err) {
                              console.error(err.message);
                              bot.sendMessage(chatId, 'Помилка при збереженні посилання');
                              return;
                          }
                          bot.sendMessage(chatId, `Нове посилання створено: ${generatedLink}`, {
                              reply_markup: {
                                  inline_keyboard: [
                                      [{ text: 'Назад', callback_data: 'offers' }]
                                  ]
                              }
                          });
                      });
                  }).catch((error) => {
                      bot.sendMessage(chatId, `Помилка при створенні посилання: ${error}`);
                  });
              }





            // TEST2
              switch (data) {
                case 'link2':
                  checkLinkExistence1(userName, bot, chatId, messageId);
                  break;
              }
              
              function checkLinkExistence1(userName, bot, chatId, messageId) {
                db.get(`SELECT * FROM user1 WHERE username = ?`, [userName], (err, row) => {
                  if (err) {
                    console.error(err.message);
                    bot.sendMessage(chatId, 'Помилка при перевірці посилання');
                    return;
                  }
                  if (row && row.test1) {
                    bot.sendMessage(chatId, 'Посилання вже створено!');
                  } else {
                    generateLink(chatId, messageId, userName, bot);
                  }
                });
              }
              
              function checkLinkExistence1(userName, bot, chatId, messageId) {
                db.get(`SELECT * FROM user1 WHERE username = ?`, [userName], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        bot.sendMessage(chatId, 'Помилка при перевірці посилання');
                        return;
                    }
                    if (row && row.test1) {
                        bot.sendMessage(chatId, 'Посилання вже створено! Перегляньте його в статистиці', {
                          reply_markup: {
                              inline_keyboard: [
                                  [{ text: 'Назад', callback_data: 'offers' }]
                              ]
                          }
                      });
                    } else {
                        generateLink1(chatId, messageId, userName, bot);
                    }
                });
            }
            
            function generateLink1(chatId, messageId, userName, bot) {
                bot.createChatInviteLink(-1002027403155, { name: userName }).then((inviteLink) => {
                    const generatedLink = inviteLink.invite_link;
                    db.run(`INSERT INTO user1(username, test1) VALUES(?, ?)`, [userName, generatedLink], (err) => {
                        if (err) {
                            console.error(err.message);
                            bot.sendMessage(chatId, 'Помилка при збереженні посилання');
                            return;
                        }
                        bot.sendMessage(chatId, `Нове посилання створено: ${generatedLink}`, {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: 'Назад', callback_data: 'offers' }]
                                ]
                            }
                        });
                    });
                }).catch((error) => {
                    bot.sendMessage(chatId, `Помилка при створенні посилання: ${error}`);
                });
            }
            
          })




          