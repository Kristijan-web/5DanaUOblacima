// Za protect middleware bitno je proveriti sledece edge case-ove

// - Provera da li je korisnik ulogovan (Da li postoji JWT token)

// - Validacija JWT tokena

// - Provera da li je korisniku u medjuvremenu obrisan nalog

// - Provera da li je sifra i dalje validna, to jest ako je korisnik promenio sifru, onda ne bih trebao da moze da radi stari jwt token

// - Izmeni req objekat i dodaj user-a iz baze req.user = currentUser i na kraju next()
