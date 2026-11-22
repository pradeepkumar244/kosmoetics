KOSMO ETICS WEBSITE: WHAT IS WHERE

index.html       Page layout and fixed text (offer banner, "Why customers book with us", about section, footer)
css/style.css    Colours, fonts, spacing (colours are at the top, in :root)
js/data.js       EDIT THIS MOST: WhatsApp number, business name, services and prices, reviews, FAQs, gallery photo list
js/app.js        Booking logic and WhatsApp/Google Calendar message (change only if you know code)
images/          Your photos (see images/README.txt)

COMMON CHANGES
- Price or new service ......... js/data.js, SERVICES list. Copy one line and change it
- Add a customer review ......... js/data.js, REVIEWS list
- Add photos .................... put files in images/, add names to GALLERY in js/data.js
- Change WhatsApp number ........ js/data.js, WHATSAPP (91 + 10 digits)
- Offer banner / about text ..... index.html (search for the words and edit them)
- Opening hours ................. js/app.js, the time-slot loop (9 AM to 7 PM)

TEST: open index.html in Chrome or Safari.
GO LIVE FREE: app.netlify.com/drop, drag this whole folder onto the page.
