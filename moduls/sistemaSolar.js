import { Estrella } from './Estrella.js';
import { Planeta } from './Planeta.js';
//radi en Km, massa en yottagrams, edat en bilions d'anys, color en hexadecimal, Tsuperficial en K, Lluminositat en gigawatts, vRotacio en Km/s, gravetat en m/s^2, periode en dies
let punt = new Object({x:0, y:0});
const SISTEMASOLAR = [new Estrella('Sol', 69600, 1988550000, 4.57, ['#FFFF00', '#FF0000'], Object.create(punt), 1.997, 0, 'El Sol és una estrella situada al centre del sistema solar. Es tracta d\'una esfera gairebé perfecta de plasma calent portada a la incandescència per les reaccions de fusió nuclear que es produeixen al seu nucli i que radia energia majoritàriament en forma de llum visible i radiació infraroja. És amb molta diferència la font d\'energia més important per a la vida a la Terra. Té un diàmetre d\'aproximadament 1,39 milions de quilòmetres, xifra que equival a uns 109 diàmetres terrestres.', 5772, 382800000000000000),
    new Planeta('Mercuri', 2439.7, 328.5, 4.6, ["#E7E8EC", "#B1ADAD"], Object.create(punt), 0.0030, 0.03, 'Mercuri és el planeta més proper al Sol i el més petit del sistema solar.[9] Fa una volta al Sol cada 88 dies. Mercuri és brillant quan es veu des de la Terra, amb una magnitud aparent de −2,0 a 5,5, però no es veu fàcilment, ja que la seva màxima separació angular amb el Sol és només de 28,3°. Tan sols es pot veure a l\'alba i al crepuscle.', 3.7, 47,87, 58.65), 
    new Planeta('Venus', 6051.8, 4868.5, 4.5, ["#F8E2B0", "#D3A567"], Object.create(punt), 0.0018, 2.64, 'Venus és el segon planeta en proximitat al Sol, al voltant del qual gira una vegada cada 224,7 dies terrestres. El planeta s\'anomena així en honor de Venus, la deessa romana de l\'amor. Sense comptar la Lluna, és l\'objecte natural més brillant al cel nocturn, arribant a una magnitud aparent de −4,6. Com que Venus és més interior que la Terra, sempre apareix a prop del Sol: la seva elongació arriba a un màxim de 47,8°. La brillantor màxima de Venus és poc abans de l\'alba o poc després de la posta, raó per la qual de vegades s\'anomena l\'estel de l\'alba, del matí o de la tarda.', 8.87, 35.02, -243), 
    new Planeta('Terra', 6371, 5971, 4.5, ["#9FC164", "#6B93D6"], Object.create(punt), 0.4651, 23.44, 'La Terra és el tercer planeta del sistema solar segons la seva proximitat al Sol i l\'únic astre que se sap que té vida. Un 29% de la seva superfície és coberta per terra en forma de continents i illes i un 71% per aigua, la major part de la qual es troba als mars i els oceans, que formen la hidrosfera conjuntament amb els llacs, els rius i altres masses d\'aigua dolça.', 9.81, 29.78, 1), 
    new Planeta('Mart', 3396.2, 641.71, 4.6,  ["#EF1501", "#AD0000"], Object.create(punt), 0.06699, 6.68, 'Mart és el quart planeta del sistema solar segons la seva proximitat al Sol i el segon més petit, després de Mercuri. Duu el nom del déu de la guerra romà i és conegut com el «planeta vermell» o «planeta roig» per l\'efecte de l\'òxid de ferro que té a la superfície, que li dóna un aspecte rogenc únic entre els astres visibles a ull nu. És un planeta tel·lúric amb una atmosfera tènue i un relleu que recorda els cràters d\'impacte de la Lluna i les valls, els deserts i els casquets polars de la Terra.', 3.71, 24.07, 1.03), 
    new Planeta('Júpiter', 69911, 1898000, 4.5, ["#D8CA9D", "#A59186"], Object.create(punt), 12.6, 25.19, 'Júpiter és el cinquè planeta del sistema solar segons la seva proximitat al Sol i el més gran de tots. Es tracta d\'un gegant gasós amb una massa equivalent a una mil·lèsima part de la massa del Sol o dues vegades i mitja la massa de tots els altres planetes del sistema solar junts. Té un diàmetre de 142.984 km (unes 11 vegades el de la Terra). La seva òrbita se situa aproximadament a 5 UA (750.000.000 km) del Sol, entre les òrbites de Mart i Saturn.', 24.79, 13.0697, 0.41),
    new Planeta('Saturn', 60268, 568460, 4.5, ["#F4D587", "#F4A587"], Object.create(punt), 9.87, 26.73, 'Saturn és el sisè planeta del sistema solar segons la seva proximitat al Sol i el segon més gran, després de Júpiter. Es classifica com un gegant gasós o jovià, que significa \'semblant a Júpiter\'. S\'anomena així en honor del déu romà Saturn, equivalent al déu grec Kronos (el pare tità de Zeus), al babiloni Ninurta i a l\'hindú Shani. El símbol de Saturn representa la falç del déu romà (en Unicode: ♄).', 8.96, 9.69, 0.44), 
    new Planeta('Urà', 25362, 86810, 4.5, ["#E1EEEE", "#ADB0C3"], Object.create(punt), 2.59, 82.23, 'Urà és el setè planeta del sistema solar segons la seva proximitat al Sol. Fou anomenat en referència al déu grec del cel, Urà, que en la mitologia grega era el pare de Cronos (Saturn) i l\'avi de Zeus (Júpiter). És el tercer planeta més gran i el quart més massiu del sistema solar. La seva composició química és semblant a la de Neptú, però diferent de la dels gegants gasosos més grans, Júpiter i Saturn, per la qual cosa els científics sovint es refereixen a Urà i Neptú com a «gegants de glaç» per distingir-los dels altres gegants gasosos.', 8.69, 6.81, -0.72), 
    new Planeta('Neptú', 24764, 10241.3, 4.5, ["#85ADDB", "#3F54BA"], Object.create(punt), 2.68, 28.32, 'Neptú és el vuitè planeta en distància respecte al Sol i el més llunyà del sistema solar. S\'anomena en honor del déu romà del mar, i és el quart planeta en diàmetre i el tercer més gran per massa. La seva massa és 17 vegades la de la Terra i lleugerament més massiu que el seu planeta «bessó» Urà, que té 15 masses terrestres i no és tan dens. De mitjana, Neptú gira entorn del Sol a una distància de 30,1 UA. El seu símbol astronòmic és Símbol astronòmic de Neptú, una versió estilitzada del trident del déu Neptú.', 11.15, 5.43, 0.72)
];

export {SISTEMASOLAR as SISTEMASOLAR};