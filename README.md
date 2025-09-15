## Socket.IO Harjoitus

Aloitin harjoituksen socket.io tutoriaalin perusteella. Sain tunnilla lisättyä harjoitukseen huoneet ja sain koodin toimimaan lokaalisti.

En käyttänyt namespaceja, mutta niillä voidaan luoda erillisiä "endpointtejä" socket yhteyksille. Eri namespacessa voi toimia samat huoneet täysin erillään toisen namespaceen huoneista käsittääkseni.

Tämä harjoitus kiinnosti minua paljon, joten laajensin projektia.

- Muutin projektin kansiorakenteet oikeanlaiseksi (client ja server kansiot)
- Lisäsin typescript tuen
- Loin client puolelle viestien encryptauksen ja decryptauksen crypto-js kirjastolla
- Lisäsin docker tuen

Dockerin kanssa taistelin paljon, sillä en meinannut millään saada clientin nginx konffausta toimimaan oikein.

Deployasin projektin kotipalvelimelleni (kuten edellisen tehtävän)

Chat sovellusta voi testata osoitteessa https://socket.latexi.dev/
