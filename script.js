/**
 * Pet Health Insurance Form JavaScript
 * Handles form validation, breed selection, and user interactions
 * for German pet insurance calculation form
 */

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('insuranceForm');
    const plzInput = document.getElementById('plz');
    const tierKategorieSelect = document.getElementById('tierKategorie');
    const rasseSelect = document.getElementById('rasse');
    const gesundheitsproblemeRadios = document.querySelectorAll('input[name="gesundheitsprobleme"]');
    const behandlungsFrage = document.getElementById('behandlungsFrage');
    const krankheitenListe = document.getElementById('krankheitenListe');
    const submitButton = document.getElementById('berechnenButton');
    
    // Treatment checkboxes
    const keinBesuchCheckbox = document.getElementById('neue_kein_besuch');
    const heilbehandlungCheckbox = document.getElementById('neue_heilbehandlung');
    const operationCheckbox = document.getElementById('neue_operation');
    const operationAnzahl = document.getElementById('operationAnzahl');

    // ===============================
    // POSTAL CODE TO CITY MAPPING
    // ===============================
    // German postal code to city mapping (sample data)
    const plzCityMap = {
        '01067': 'Dresden',
        '10115': 'Berlin', 
        '20095': 'Hamburg',
        '80331': 'München',
        '50667': 'Köln',
        '60311': 'Frankfurt am Main',
        '70173': 'Stuttgart',
        '40213': 'Düsseldorf'
    };

    // ===============================
    // BREED DATA DEFINITIONS
    // ===============================
    // Comprehensive breed database for cats, dogs, and horses
    const breedData = {
        katze: [
            'Mischling / Hauskatze / Europäisch Kurzhaar',
            'Maine Coon',
            'Perser / Colourpoint',
            'Siam',
            'Britisch Kurzhaar',
            'Norwegische Waldkatze',
            'Bengal',
            'Burma Shorthair',
            'Abessinier',
            'American Bobtail Longhair',
            'American Bobtail Shorthair',
            'American Curl Longhair',
            'American Curl Shorthair',
            'American Lynx',
            'American Shorthair',
            'American Wirehair',
            'Balinese',
            'Birma',
            'Bombay',
            'Burma Longhair',
            'Burmilla',
            'California Spangled',
            'Ceylon',
            'Chartreux',
            'Chausie',
            'Cymric',
            'Exotische Kurzhaarkatze',
            'Havanna',
            'Japanese Bobtail Longhair',
            'Japanese Bobtail Shorthair',
            'Kanaani',
            'Korat',
            'Kurilean Bobtail Longhair',
            'Kurilean Bobtail Shorthair',
            'La Perm Longhair',
            'La Perm Shorthair',
            'Manx',
            'Munchkin Longhair',
            'Munchkin Shorthair',
            'Nebelung',
            'Ocicat',
            'Ojos Azules',
            'Oriental Longhair',
            'Oriental Shorthair',
            'Peterbald',
            'Pixiebob Longhair',
            'Pixiebob Shorthair',
            'Rex',
            'RagaMuffin',
            'Ragdoll',
            'Russisch Blau',
            'Safari',
            'Savannah',
            'Scottish Fold Longhair',
            'Scottish Fold Shorthair',
            'Sibirische Katze',
            'Singapura',
            'Snowshoe',
            'Sokoke',
            'Somali',
            'Sphynx',
            'Thai',
            'Tonkanese',
            'Toyger',
            'Türkisch Angora',
            'Türkisch Van',
            'York Chocolate',
            'Serengeti',
            'Bunny cat',
            'Hasenkatze',
            'Mau, Ägyptische',
            'Mau, Egyptian',
            'Stummelschwanzkatze Langhaar, Amerikanische',
            'Stummelschwanzkatze Kurzhaar, Amerikanische',
            'Luchskatze, Amerikanische',
            'American Shorthair in chocolate-silver',
            'Balinesenkatze',
            'Leopardette',
            'Heilige Birm',
            'Birman',
            'Sacred Birman',
            'British Shorthair',
            'Ceylonkatze',
            'Ceylon cat',
            'Chartreuse',
            'Karthäuser',
            'Manx, Longhaired',
            'Manxkatze, Langhaarige',
            'Kymrische Katze',
            'Exotic Shorthair',
            'Exotic',
            'Havanna Brown',
            'Boby',
            'Stummelschwanzkatze, Japanische',
            'Chrysanthemenkatze, Langhaar',
            'Chrysanthemenkatze, Kurzhaar',
            'Kanaan-Katze',
            'Si-Sawat',
            'Maeo Dok-Lao',
            'Kurilian Bobtail',
            'Stummelschwanzkatze, Karelische',
            'Karelisch Bobtail, Langhaar',
            'Nibelung',
            'Norweger',
            'Norwegian Forest Cat',
            'Skogkatt',
            'Nors Skaukatt',
            'Ocikatze',
            'Orientalisch Langhaar',
            'Javanese/Mandarin',
            'Orientalisch Kurzhaar',
            'OKH, Foreign Shorthair',
            'Rex, Bohemian',
            'Rex, California',
            'Rex, Cornish',
            'Rex, Devon',
            'Rex, German',
            'Rex, Oregon',
            'Rex, Selkirk',
            'Rex, Ural',
            'Russische Katze',
            'Russian Blue',
            'Bleu Russe',
            'Archangelsk-Katze',
            'Malterkatze',
            'Spanische Katze',
            'Highland Fold',
            'Coupari',
            'Hängeohrenkatze Langhaar, Schottische',
            'Faltohrkatze Langhaar, Schottische',
            'Hängeohrenkatze Kurzhaar, Schottische',
            'Faltohrkatze Kurzhaar, Schottische',
            'Siamese',
            'Waldkatze, Sibirische',
            'Sibirian Cat',
            'Sibirska Koschka',
            'Sibirski',
            'Neva Masquerade',
            'Drain Cat',
            'Schneeschuhkatze',
            'Canadian Hairless',
            'Mexican Hairless',
            'Moon Cat',
            'Nacktkatze',
            'Siam alter Typ',
            'Tonkinese',
            'Siamese, Goldener',
            'Angorakatze',
            'Ankarakatze',
            'Ankara kedisi',
            'Vankatze',
            'Schwimmkatze',
            'Türkische Katze',
            'Turkish',
            'Van Kedesi',
            'Türkisch Vankedisi',
            'Karelisch Bobtail, Kurzhaar',
            'Deutsch Langhaar'
        ],
        hund: [
            'Mischling, groß\n(Widerristhöhe ab 45 cm)',
            'Mischling, klein\n(Widerristhöhe bis 45 cm)',
            'Labrador',
            'Retriever, Golden',
            'Terrier, Jack Russell',
            'Schäferhund, Deutscher',
            'Dackel',
            'Bulldogge, Französische\n(Bouledogue Francais)',
            'Chihuahua',
            'Collie, Border',
            'Afghan Hound',
            'Afghane',
            'Aidi',
            'Aiidi',
            'Ainu-Hund',
            'Ainu-Inu',
            'Akbas',
            'Akita',
            'Akita Ken',
            'Akita, Japanischer',
            'Akita-Inu',
            'Akitu, Amerikanischer',
            'Alano',
            'Alaskan Malamute',
            'Alauntbull',
            'Amerikanischer Königs-Schäferhund',
            'Andalousian Mouse-Hounting Dog',
            'Anglo-Franzose, Großer',
            'Anglo-Franzose, Kleiner',
            'Anglo-französischer Laufhund, Großer',
            'Anglo-französischer Laufhund, mittelgroßer',
            'Anglo-français de petite vénerie',
            'Apso Seng Kyi',
            'Apso, Dholi',
            'Apso, Doki-',
            'Apso, Tibet-',
            'Ariégeois',
            'Artois Hound',
            'Aussie',
            'Ayidi',
            'Azawakh',
            'Aïdi',
            'Barac',
            'Barb',
            'Barbet',
            'Bardino',
            'Bardino auténtico',
            'Bardino Majorero',
            'Barsoi',
            'Barzoï',
            'Bas Rouge',
            'Basendschi',
            'Basenji',
            'Basset',
            'Basset Artesien Normand\n(Basset Artois)',
            'Basset Bleu de Gascogne\n(Basset der Gascogne, Blauer)',
            'Basset d\'Artois',
            'Basset Fauve de Bretagne',
            'Basset Griffon',
            'Basset Griffon Vendéen, Grand\n(B.G.V., Großer)',
            'Basset Griffon Vendéen, Petit\n(B.G.V., Kleiner)',
            'Basset Hound',
            'Bauernhund, Schweizer',
            'Beagle',
            'Beagle Harrier',
            'Beagle, English',
            'Beardie',
            'Beauceron',
            'Bergamasco',
            'Bergamasker',
            'Berger belge',
            'Berger Blanc Suisse',
            'Berger de Beauce',
            'Berger de Brie (Briard)',
            'Berger de l\'Atlas',
            'Berger de Picardie',
            'Berger de Pyrènèes á face rase\n(Pyrenäen-Schäferhund mit kurzhaarigem Gesicht)',
            'Berger des Pyrénées',
            'Berger des Pyrénées á poil long\n(Langhaariger Pyrenäen-Schäferhund, Pyrenäenschäferhund)',
            'Berger Picard',
            'Berghund, Atlas',
            'Berghund, Polnischer',
            'Berghund, Serra da Estrela',
            'Berghund, Tatra-',
            'Bernhardiner',
            'Bichon Bolognais',
            'Bichon frisé',
            'Bichon havanais',
            'Bichon Maltais',
            'Bichon à poil frisé',
            'Bichon, Gelockter',
            'Billy',
            'Bloodhound',
            'Blue Heeler',
            'Bluthund',
            'Bobtail\n(Old English Sheepdog)',
            'Bodeguero Andaluz',
            'Boerboel',
            'Bolognese',
            'Bologneser',
            'Bolonka Zwetna',
            'Bolonka, Franzuska',
            'Bolonka, Franzuskaya',
            'Boolomo',
            'Bordeauxdogge\n(Dogge, Bordeaux-, Dogge de Bordeaux)',
            'Borsoi',
            'Boston Bull(dog)',
            'Bouvier des Ardennes',
            'Bouvier des Flandres',
            'Boxer, Deutscher',
            'Brabancon',
            'Brabancon, Petit',
            'Bracke, Alpenländische Dachs-\n(Alpine Dachs-, Erzgebirgische Dachs-, Österreichische Dachs-)',
            'Bracke, Ariège-\n(Braque de l\'Ariège)',
            'Bracke, Balkan-',
            'Bracke, Bayerische Gebirgs-',
            'Bracke, Brandl-\n(Vieräugl)',
            'Bracke, Burbonnaiser\n(Braque du Bourbonnais)',
            'Bracke, Dunker-',
            'Bracke, Französische\n(Braque francais - type Gascogne/type Pyrénées)',
            'Bracke, Französische Klein-',
            'Bracke, Griechische',
            'Bracke, Halden',
            'Bracke, Hamilton-',
            'Bracke, Hygen-',
            'Bracke, Italienische\n(Bracco Italiano)',
            'Bracke, Polnische',
            'Bracke, Saint-Germain-',
            'Bracke, Schiller-',
            'Bracke, Sizilianische',
            'Bracke, Smaland-',
            'Bracke, Westfälische Dachs-',
            'Bracken',
            'Bracken, Dachs-',
            'Braque d\'Auvergne',
            'Briard',
            'Briquet',
            'Broholmer',
            'Broholmer, Dänischer',
            'Buhund',
            'Buhund, Norsk',
            'Bull Terrier, English',
            'Bulldog, American',
            'Bulldog, Continental',
            'Bulldog, Old Country',
            'Bulldogge',
            'Bulldogge, Englische',
            'Bulldogge, Italienische',
            'Bullterrier, American Pit-',
            'Bullterrier, Amerikanischer Pit-',
            'Bullterrier, Miniatur-',
            'Bullterrier, Zwerg',
            'Bärenhund',
            'Bärenhund, Germanischer',
            'Bärenhund, Karelischer',
            'Ca de Bestiar',
            'Ca de Bou',
            'Ca Rater Mallorquin',
            'Canaan Dog',
            'Cane Corso',
            'Cane da Pastore',
            'Cane da pastore Bergamasco',
            'Cane da Pastore Maremmano Abruzzese',
            'Cane di seguito',
            'Cane die Macellaio',
            'Cao de Fila',
            'Carlin',
            'Carlino',
            'Carpatin, Ciobanesc Romanesc',
            'Castro Laboreiro Hund',
            'Cattle Dog, Australian',
            'Chart Polski',
            'Chien couranr espagnol',
            'Chien courant Hamilton',
            'Chien courant Hygen',
            'Chien Courant Suisse',
            'Chien d\'Artois',
            'Chien de Beauce',
            'Chien de Berger Belge',
            'Chien de berger de Majorque',
            'Chien de Franche-Comté',
            'Chien de l\'Atlas',
            'Chien de montagne des Pyrénées',
            'Chien de Saint-Hubert',
            'Chin',
            'Chodenhund',
            'Chodsky pes',
            'Chortaj',
            'Chortaja Borzaja',
            'Chow-Chow',
            'Chrysanthemenhund',
            'Cimarron, Uruguayischer',
            'Cimarrón Uruguayo',
            'Cirneco dell\'Etna',
            'Coban Köpegi',
            'Cockerspaniel',
            'Cockerspaniel, Amerikanischer',
            'Cockerspaniel, Englischer',
            'Collie',
            'Collie, Bearded',
            'Collie, Hairy Mou ed',
            'Collie, Highland',
            'Collie, Kurzhaar\n(Collie Smooth)',
            'Collie, Langhaar\n(Collie Rough)',
            'Collie, Mountain',
            'Congo Dog',
            'Coonhound, Black and Tan',
            'Corgi, Welsh',
            'Corgi, Welsh (Cardigan)',
            'Corgi, Welsh (Pembroke)',
            'Corso Hund, Italienischer',
            'Coton de Tuléar',
            'Curly, Retriever, kraus gelockter',
            'Cuvac',
            'Cão da Serra da Estrela',
            'Cão da Serra de Aires',
            'Cão de Agua português',
            'Cão de Castro Laboreiro',
            'Cão Fila de São Miguel',
            'Dachsbracke, Schwedische',
            'Dachshund',
            'Dackel, Kaninchen-',
            'Dackel, Kurzhaar-',
            'Dackel, Langhaar-',
            'Dackel, Rauhhaar-',
            'Dackel, Zwerg-',
            'Dalmatinac',
            'Dalmatiner',
            'Deerhound',
            'Deerhound, Scottish',
            'Deutsch Drahthaar',
            'Deutsch Kurzhaar',
            'Deutsch Langhaar',
            'Deutsch Stichelhaar',
            'Dingo',
            'Dingo, Australischer',
            'Do Khyi',
            'Dobermann',
            'Dobermann, Mini-',
            'Dogge',
            'Dogge, Argentinische',
            'Dogge, Deutsche',
            'Dogge, Englische',
            'Dogge, Italienische',
            'Dogge, Kanarische',
            'Dogge, Spanische',
            'Dogge, Tibet',
            'Dogo Argentino',
            'Dogo Canario',
            'Doguillo',
            'Drentse Patrijshond',
            'Drever',
            'Dunker',
            'Elchhund',
            'Elchhund, Norwegischer\n(Norsk Elghund)',
            'Elchhund, Schwedischer (Jämthund)',
            'Elo',
            'Elo, Groß-',
            'Elo, Klein-',
            'Entenlockhund, Holländischer',
            'Epagneul Breton',
            'Epagneul de Pont-Audemer',
            'Epagneul français',
            'Epagneul nain continental',
            'Epagneul Picard',
            'Eurasier',
            'Faltenhund, Chinesischer',
            'Fila Brasileiro',
            'Fox Paulistinha',
            'Foxhound, American',
            'Foxhound, Amerikanischer',
            'Foxhound, Englischer',
            'Foxhound, English',
            'Foxterrier Smooth',
            'Foxterrier Wire',
            'Foxterrier, Kurzhaar',
            'Foxterrier, Rauhaar',
            'Francais blanc et noir',
            'Francais blanc et orange',
            'Francais tricolore\n(Laufhund, Französischer Dreifarbiger)',
            'Friaar-Hund',
            'Fuchshund, Englischer',
            'Galgo Español',
            'Gammel Dansk Honsehund',
            'Gascogne Laufhund, Großer Blauer',
            'Gascogner, Großer Blauer',
            'Gascogner, Kleiner blauer',
            'Gascon Saintongeois, Großer',
            'Gascon Saintongeois, Kleiner',
            'Gascony Hound, Small Blue',
            'Gazellenhund',
            'Gebirgsbracke, Bayerische',
            'German Trail Hound',
            'Goldendoodle',
            'Goralenhund',
            'Gos d\'Atura Català',
            'Grand anglo-français',
            'Grand bleu de Gascogne',
            'Grand Gascon Saintongeois',
            'Greyhound',
            'Greyhound, Polish',
            'Greyhound, Spanish',
            'Griffon',
            'Griffon Belge',
            'Griffon bleu de Gascogne\n(Gascogne Griffon, Blauer)',
            'Griffon Bruxellois',
            'Griffon Fauve de Bretagne',
            'Griffon Korthals',
            'Griffon Nivernais',
            'Griffon Vendéen',
            'Griffon á poil Laineux',
            'Griffon, Belgischer',
            'Griffon, Brabanter',
            'Griffon, Brüsseler',
            'Griffon, Kleiner belgischer',
            'Groenendael',
            'Grönlandhund',
            'Grönlandshund',
            'Haldenstövare',
            'Hall\'s Heeler',
            'Hamilton Hound',
            'Hamiltonstövare',
            'Hannoveraner',
            'Harrier',
            'Harzer Fuchs',
            'Haut Poitou',
            'Havaneser',
            'Heeler\n(Australischer)',
            'Heidewachtel',
            'Hellinikos Ichnilatis',
            'Herder',
            'Herdershond, Hollandse',
            'Herdershond, Nederlandse',
            'Hirschhund, Schottischer',
            'Hirtenhund, Anatolischer',
            'Hirtenhund, Bergamasker',
            'Hirtenhund, Jugoslawischer',
            'Hirtenhund, Kangal-',
            'Hirtenhund, Katalanischer',
            'Hirtenhund, kaukasisch',
            'Hirtenhund, Maremmaner',
            'Hirtenhund, Tatra-',
            'Hirtenhund, Türkischer',
            'Hirtenhund, Ungarischer',
            'Hokkaido',
            'Hokkaido-Ken',
            'Hort',
            'Hortaya Borzaya',
            'Horty',
            'Hovawart',
            'Hrvatski Ovcar',
            'Hubertus-Hund, (Sankt-)',
            'Husky',
            'Husky, Alaskan',
            'Husky, Siberian',
            'Hygen Hound',
            'Hygenhund',
            'Hühnerhund, Altdänischer',
            'Hühnerhund, Burgos-',
            'Hühnerhund, Drent`scher',
            'Hütehund, Altdeutscher',
            'Hütehund, Pyrenäen-',
            'Ioujnorousskaia Ovtcharka',
            'Islandhund',
            'Islandsk Farehond',
            'Islanskur Fjarhundur',
            'Islenski Fjarhundutinn',
            'Jagdterrier, Westdeutscher',
            'Jagdwindhund, Russischer',
            'Japan Chin',
            'Jindo',
            'Jindo-Kae',
            'Jindo-kyon',
            'Jugoslovenski Ovcarski Pas-Sarplaninac',
            'Kai',
            'Kai Inu',
            'Kai tora-ken',
            'Kampfhund, Chinesischer',
            'Kampfhund, Japanischer',
            'Kampfhund, Tosa-',
            'Kanaan Hund',
            'Kangal',
            'Kangal Cobas Köbegi',
            'Karabas',
            'Karabash',
            'Kars-Hund',
            'Kavkazskaia Ovtcharka',
            'Kelb-tal Fenek\n(Kaninchenhund)',
            'Kelef K\'naani',
            'Kelpie',
            'Kelpie, Australian',
            'Kelpie, Australischer',
            'Kelpie, Working',
            'Kirghiz Borzoi',
            'Kishu',
            'Kishu Ken',
            'Kishu-Inu',
            'Kochi-Hund',
            'Kochi-Ken',
            'Koehond, Vlaamse',
            'Koikerhund',
            'Komondor',
            'Kooikerhondje',
            'Korea Jindo Dog',
            'Kraski ovcar',
            'Kromfohrländer',
            'Kuvasz',
            'Labradoodle',
            'Laekenois',
            'Lagotto Romagnolo',
            'Laika',
            'Landseer',
            'Landseer, Europäisch-kontinentaler',
            'Landseer-Neufundländer',
            'Lao Khyi',
            'Lapphund',
            'Lapphund, Finnischer\n(Suomenlapinkoira, Lapinkoira)',
            'Lapphund, Schwedischer\n(Lappenspitz, Spitz, Lappen-)',
            'Lapplandhirtenhund, Finnischer',
            'Laufhund, Ariege',
            'Laufhund, Berner',
            'Laufhund, Dunker-',
            'Laufhund, Französischer',
            'Laufhund, Griechischer',
            'Laufhund, Hamilton-',
            'Laufhund, Hygen-',
            'Laufhund, Italienischer',
            'Laufhund, Jura',
            'Laufhund, Kleiner blauer Gascogne',
            'Laufhund, Kleiner Portugiesischer',
            'Laufhund, Luzerner',
            'Laufhund, Norwegischer',
            'Laufhund, Schiller-',
            'Laufhund, Schwyzer',
            'Laufhund, Smaland-',
            'Laufhund, Spanischer',
            'Laufhunde, Schweizerische',
            'Lebrel Polaco',
            'Leonberger',
            'Lhasa Apso',
            'Lhasaterrier',
            'Little River Duck Dog',
            'Lockenhaar, Friesisches',
            'Lundehund, Norwegischer',
            'Lurcher',
            'Lévrier polonaise',
            'Löwchen',
            'Löwenhund',
            'Löwenhund, Afrikanischer',
            'Magyar Agar',
            'Magyar Vizsla',
            'Mah Tai',
            'Majorca Sheperd Dog',
            'Maliki',
            'Malinois',
            'Mallorca-Dogge',
            'Maltese',
            'Malteser',
            'Manchester Terrier, Toy',
            'Mastiff',
            'Mastiff, (Old) English',
            'Mastiff, Alentejo-',
            'Mastiff, Bull-',
            'Mastiff, Japanischer',
            'Mastiff, Pyrenäen-',
            'Mastiff, Spanischer',
            'Mastiff, Tibet',
            'Mastiff, Tibetanischer',
            'Mastin aus León\n(mastin leonés)',
            'Mastin de los Pirineos',
            'Mastin del Pirineo',
            'Mastin der Extramadura\n(mastin extremeno)',
            'Mastin der Mancha\n(mastin manchego)',
            'Mastin Español',
            'Mastino Napoletano',
            'Merlsheimer',
            'Metzgerhund, Rottweiler',
            'Mikawa-Inu',
            'Minpin',
            'Mioritic',
            'Mioritic, Ciobanesc Romanesc',
            'Miortic, Romanian',
            'Mirigung',
            'Mocano',
            'Mops',
            'Moscow Watchdog',
            'Moskowskaia Storozewaia',
            'Moszkvai Örkutya',
            'Mudi',
            'Münsterländer, Großer',
            'Münsterländer, Kleiner',
            'Nackt-/Schopfhund',
            'Nackthund, Afrikanischer',
            'Nackthund, Chinesischer',
            'Nackthund, Mexikanischer',
            'Nackthund, Peruanischer',
            'Neufundländer',
            'Newfoundland',
            'Niederlaufhund, Berner\n(Glatthaar/Rauhhaar)',
            'Niederlaufhund, Jura',
            'Niederlaufhund, Luzerner',
            'Niederlaufhund, Schwyzer',
            'Niederlaufhunde, Schweizerische',
            'Niederungshütehund, Polnischer',
            'Nihon Teria',
            'Noggum',
            'Norfolk Spaniel',
            'Norsk Lundehund',
            'Nurse Maid',
            'Otterhound',
            'Otterhund',
            'Owczarek Podhalanski',
            'Owtscharka, Kaukasischer',
            'Owtscharka, Mittelasiatischer',
            'Owtscharka, Südrussischer',
            'Owtscharka, Zentralasiatischer',
            'Palasthund, Chinesischer',
            'Palasthund, Peking-',
            'Papillon',
            'Pas-Sarplaninac',
            'Patterdale Terrier',
            'Pekinese',
            'Pekingese',
            'Pequeno León',
            'Pequeno Sabuesoazul de Gascuna',
            'Perdiguero (Hühnerhund/Vorstehhund) von Burgos',
            'Perdiguero Burgales',
            'Perdiguero de Burgos',
            'Perro Criollo',
            'Perro de agua Español',
            'Perro de Ganado Majorero',
            'Perro de Majorero',
            'Perro de Pastor Catalán',
            'Perro de pastor Mallorquin',
            'Perro de Presa Canario',
            'Perro de Presa Mallorquin',
            'Perro dogo mallorquin',
            'Perro Gaucho',
            'Perro Ratonero Bodeguero',
            'Petit bleu de Gascogne',
            'Petit chien courant suisse',
            'Petit Chien lion',
            'Petit Gascon Saintongeois',
            'Phalene',
            'Pharaoh Hound',
            'Pharaonenhund',
            'Piccolo Levriero Italiano',
            'Pinscher',
            'Pinscher, Affen-',
            'Pinscher, Deutscher',
            'Pinscher, Dobermann-',
            'Pinscher, Miniature',
            'Pinscher, Mittelschlag-',
            'Pinscher, Reh-',
            'Pinscher, Zwerg-',
            'Pit-Bullterrier, American',
            'Pit-Bullterrier, Amerikanischer',
            'Podenco',
            'Podenco Canario',
            'Podenco Ibicenco',
            'Podengo',
            'Podengo Portugues\n(grande/medio)',
            'Podengo Portugueso Pequeno',
            'Podengo, Kleiner',
            'Podengo, Kleiner Portugiesischer',
            'Podengo, Portugiesischer\n(großer/mittelgroßer)',
            'Podhalaner',
            'Podhalenhund',
            'Pointer',
            'Pointer, Englischer',
            'Pointer, English',
            'Poitevin',
            'Polski Owczarek Nizinny',
            'Polski Owczarek Podhalanski',
            'PON\n(Polnischer Niederungshütehund)',
            'Porcelaine',
            'Portugiesischer Laufhund, Kleiner',
            'Prager Rattler',
            'Pudel, Groß-',
            'Pudel, Klein-',
            'Pudel, Königs-',
            'Pudel, Toy',
            'Pudel, Zwerg-',
            'Pudelpointer',
            'Pug',
            'Puggle',
            'Puh Quoc Hund',
            'Puli',
            'Pumi',
            'Pyrenäenberghund',
            'Pyrenäenhund',
            'Pyrenäenhütehund',
            'Pyrenäenschäferhund',
            'Queensland-Heeler',
            'Rafeiro do Alentejo',
            'Rafeiro von Alentejo',
            'Ratero',
            'Ratonero Andaluz',
            'Ratonero Bodeguero Andaluz',
            'Rauhbart',
            'Rauhbart, Böhmischer',
            'Rauhbart, Slowakischer',
            'Rehrattler',
            'Retriever, Chesapeake Bay',
            'Retriever, Curly Coated',
            'Retriever, Flat Coated',
            'Retriever, Glatthaariger',
            'Retriever, Labrador',
            'Retriever, Nova Scotia',
            'Retriever, Nova Scotia Duck Tolling',
            'Ridgeback Dog, Thai',
            'Ridgeback, Rhodesian',
            'Ridgeback, Thai',
            'Ridgeback, Thailand-',
            'Rottweiler',
            'Russkaya Psovaya borzaya',
            'Russkiy Toy',
            'Sabueso de Hamilton',
            'Sabueso de Hygen',
            'Sabueso Español',
            'Sabueso Suizos',
            'Saluki',
            'Samoiedskaia Sabaka',
            'Samojede',
            'Samojedskaja',
            'Sarplaninac',
            'Scandinavian Hound',
            'Schafpudel, Niederländischer',
            'Schapendoes',
            'Schapendoes, Nederlandse',
            'Schapendoes, Niederländischer',
            'Schifferspitz, Belgischer',
            'Schillerstövare',
            'Schipperke',
            'Schlittenhund, Europäischer',
            'Schmetterlingshündchen',
            'Schnauzer',
            'Schnauzer, Mittel-',
            'Schnauzer, Riesen-',
            'Schnauzer, Zwerg-',
            'Schwarzwildbracke, Slowakische',
            'Schweisshund, Bayerischer Gebirgs-',
            'Schweisshund, Hannoverscher',
            'Schäfer, Weißer',
            'Schäferhund, Altdeutscher',
            'Schäferhund, Altenglischer',
            'Schäferhund, Amerikanisch Canadisch Weißer',
            'Schäferhund, Anatolischer',
            'Schäferhund, Australischer',
            'Schäferhund, Belgischer',
            'Schäferhund, Bosnisch-Herzegowinischer',
            'Schäferhund, Carpatin',
            'Schäferhund, Holländischer',
            'Schäferhund, Illyrischer',
            'Schäferhund, Isländischer',
            'Schäferhund, Istrischer',
            'Schäferhund, Jugoslawischer',
            'Schäferhund, Karst',
            'Schäferhund, Katalanisch',
            'Schäferhund, Kaukasischer',
            'Schäferhund, Kroatischer',
            'Schäferhund, Mallorca',
            'Schäferhund, Mallorquinischer',
            'Schäferhund, Maremmen-Abruzzen-',
            'Schäferhund, Marokkanischer',
            'Schäferhund, Mittelasiatischer',
            'Schäferhund, Niederländischer',
            'Schäferhund, Picardie',
            'Schäferhund, Picardischer',
            'Schäferhund, Portugiesischer',
            'Schäferhund, Pyrenäen-',
            'Schäferhund, Rumänischer',
            'Schäferhund, Schottischer',
            'Schäferhund, Shetland',
            'Schäferhund, Südrussischer',
            'Schäferhund, Tatra',
            'Schäferhund, Ungarischer',
            'Schäferhund, Weisser Schweizer',
            'Schäferhund, Weißer',
            'Schäferhund, Zentralasiatischer',
            'Scottie',
            'Segugio Italiano a pelo forte',
            'Seguiser',
            'Sennenhund',
            'Sennenhund, Appenzeller\n(Appenzellerhund, Appezöller Bläss)',
            'Sennenhund, Berner (Dürrbächler)',
            'Sennenhund, Entlebucher',
            'Sennenhund, Großer Schweizer',
            'Serra da Estrela Berghund',
            'Setter',
            'Setter, English',
            'Setter, Gordon',
            'Setter, Irish Red',
            'Setter, Irish Red and White',
            'Shar Pei',
            'Sheepdog, Carpathian',
            'Sheepdog, Mioritic',
            'Sheepdog, Old English',
            'Sheepdog, Shetland',
            'Sheltie',
            'Sheperd, American King',
            'Shepherd Dog, Romanian Carpathian',
            'Shepherd Dog, Romanian Mioritic',
            'Shepherd, Australian',
            'Shiba',
            'Shiba Inu',
            'Shiba Ken',
            'Shih Tzu',
            'Shikoku',
            'Silky, Australian',
            'Silky, Sydney',
            'Sivas Kangal',
            'Sloughi',
            'Slovensky Cuvac',
            'Slughi',
            'Smalandsstövare',
            'Spaniel, (English) Cocker',
            'Spaniel, American Cocker',
            'Spaniel, American Water',
            'Spaniel, Amerikanischer Cocker-',
            'Spaniel, Amerikanischer Wasser-',
            'Spaniel, Bretonen-',
            'Spaniel, Bretonischer',
            'Spaniel, Brittany-',
            'Spaniel, Cavalier King Charles',
            'Spaniel, Clumber',
            'Spaniel, Englischer Springer-',
            'Spaniel, English Springer',
            'Spaniel, English Toy',
            'Spaniel, Field',
            'Spaniel, Französischer',
            'Spaniel, Irischer Wasser-',
            'Spaniel, Irish Water',
            'Spaniel, King Charles',
            'Spaniel, Kontinentaler Zwerg-',
            'Spaniel, Picardie-',
            'Spaniel, Pont-Audemer',
            'Spaniel, Sussex',
            'Spaniel, Tibet',
            'Spaniel, Tibetan',
            'Spaniel, Walisischer Springer',
            'Spaniel, Welsh Springer',
            'Spanischer Schmecker',
            'Spinone',
            'Spinone Italiano',
            'Spitz',
            'Spitz, Belgischer Schiffer-',
            'Spitz, Finnen-',
            'Spitz, Groß-',
            'Spitz, Isländischer',
            'Spitz, Israel',
            'Spitz, Japan',
            'Spitz, Klein-',
            'Spitz, Mittel-',
            'Spitz, Zwerg- (Pomeranian)',
            'Spitze, Deutsche: Spitz, Wolfs\n(Keeshond, Chien Loup)',
            'Springer Spaniel, Walisischer',
            'Springer-Spaniel, Englischer',
            'St. Bernhardshund',
            'Stabijhoun',
            'Stabÿhoun',
            'Staff',
            'Staffie',
            'Staffordshire-Terrier, Amerikanischer',
            'Sumo-Inu',
            'Swiss Hounds',
            'Taigan',
            'Taiwan Dog',
            'Taiwan Hund',
            'Tajgan',
            'Tatrahund',
            'Tazi',
            'Tchouvatch Slovaque',
            'Teckel',
            'Terrier Brasileiro',
            'Terrier Smooth, Fox-',
            'Terrier Wire, Fox-',
            'Terrier, Aberdeen-',
            'Terrier, Airedale',
            'Terrier, American Pit Bull',
            'Terrier, American Staffordshire',
            'Terrier, Amerikanischer Pit Bull',
            'Terrier, Australian',
            'Terrier, Australian Silky',
            'Terrier, Australischer',
            'Terrier, Bedlington',
            'Terrier, Bingley',
            'Terrier, Black',
            'Terrier, Black and Tan Rough-Haired',
            'Terrier, Black Russian',
            'Terrier, Black-and-tan',
            'Terrier, Black-and-tan Toy',
            'Terrier, Border',
            'Terrier, Boston',
            'Terrier, Brasilianischer',
            'Terrier, Bull-',
            'Terrier, Böhmischer',
            'Terrier, Cairn',
            'Terrier, Cesky',
            'Terrier, Dandie Dinmont',
            'Terrier, Deutscher Jagd-',
            'Terrier, English Bull',
            'Terrier, English Toy',
            'Terrier, Fell-',
            'Terrier, Fox- (Drahthaar)',
            'Terrier, Fox- (Glatthaar)',
            'Terrier, Glen of Imaal',
            'Terrier, Irischer',
            'Terrier, Irischer Glen of Imaal',
            'Terrier, Irish',
            'Terrier, Irish Blue',
            'Terrier, Irish Glen of Imaal',
            'Terrier, Irish Red',
            'Terrier, Irish Soft Coated Wheaten',
            'Terrier, Japanischer',
            'Terrier, Kerry Blue',
            'Terrier, Kurzhaar Fox-',
            'Terrier, Lakeland',
            'Terrier, Lhasa-',
            'Terrier, Lucas',
            'Terrier, Manchester',
            'Terrier, Miniatur-Bull-',
            'Terrier, Nippon-',
            'Terrier, Nishon-',
            'Terrier, Norfolk',
            'Terrier, Norwich',
            'Terrier, Old English Black and Tan',
            'Terrier, Parson Russell',
            'Terrier, Parson-Jack-Russel-',
            'Terrier, Pit Bull',
            'Terrier, Rauhaar Fox-',
            'Terrier, Rothbury-',
            'Terrier, Russischer',
            'Terrier, Russischer Toy',
            'Terrier, Schottischer',
            'Terrier, Schwarzer',
            'Terrier, Schwarzer Russischer',
            'Terrier, Scotch',
            'Terrier, Scottish',
            'Terrier, Sealyham',
            'Terrier, Silky',
            'Terrier, Skye',
            'Terrier, Soft-Coated Wheaten',
            'Terrier, Staffordshire',
            'Terrier, Staffordshire Bull-',
            'Terrier, Tchiorny',
            'Terrier, Tibet',
            'Terrier, Tibetan',
            'Terrier, Toy Manchester',
            'Terrier, Tschechischer',
            'Terrier, Waliser',
            'Terrier, Waterside-',
            'Terrier, Weißer Hochland',
            'Terrier, Welsh',
            'Terrier, West Highland White',
            'Terrier, Westfalen-',
            'Terrier, Yorkshire',
            'Terrier, Zwerg Bull-',
            'Tervueren',
            'Tesem',
            'The Nanny Dog',
            'Tora Inu',
            'Tornjak',
            'Tosa',
            'Tosa Inu',
            'Toy Spaniel, English',
            'Toy Terrier, Black-and-tan',
            'Toy Terrier, Russischer',
            'Treibhund, Ardennen-',
            'Treibhund, Australischer',
            'Treibhund, Flandrischer',
            'Treibhund, Portugiesischer',
            'Tschuwatsch, Slowakischer',
            'Tsvetnaya Bolonka',
            'Ténéfiffe',
            'Verdino',
            'Virelade',
            'Vogelhund, Norwegischer',
            'Vorstehhund, Altdänischer',
            'Vorstehhund, Deutscher Drahthaariger',
            'Vorstehhund, Deutscher Kurzhaariger',
            'Vorstehhund, Deutscher langhaariger',
            'Vorstehhund, Friesischer',
            'Vorstehhund, Grosser Münsterländer',
            'Vorstehhund, Italienischer Rauhhaariger',
            'Vorstehhund, Kleiner Münsterländer',
            'Vorstehhund, Ungarischer (Drahthaar)',
            'Vorstehhund, Ungarischer (Kurzhaar)',
            'Wachhund, Moskauer',
            'Wachtel, Deutscher',
            'Wachtelhund, Deutscher',
            'Warrigal',
            'Waschbärenhund, (Amerikanischer) Schwarz-Lohfarbener',
            'Waschbärenhund, Schwarz-roter',
            'Wasserhund der Romagna',
            'Wasserhund, Französischer',
            'Wasserhund, Friesischer',
            'Wasserhund, Portugiesischer',
            'Wasserhund, Spanischer',
            'Wasserspaniel, Amerikanischer',
            'Wasserspaniel, Irischer',
            'Wasserwild-Hund, Kleiner Holländischer',
            'Water Dog, Spanish',
            'Weimaraner',
            'Westie',
            'Wetter',
            'Wetterhond',
            'Wetterhoun',
            'Whippet',
            'Windhund, Afghanischer',
            'Windhund, Arabischer',
            'Windhund, Balutschi-',
            'Windhund, Berber-',
            'Windhund, Kirgisischer',
            'Windhund, Kleiner italienischer',
            'Windhund, Kurzhaariger',
            'Windhund, Persischer',
            'Windhund, Polnischer',
            'Windhund, Russischer',
            'Windhund, Sibirischer',
            'Windhund, Spanischer',
            'Windhund, Tuareg-',
            'Windhund, Ungarischer',
            'Windspiel',
            'Windspiel, Italienisches',
            'Wolf(s)hund, Tschechoslowakischer',
            'Wolf-Chow',
            'Wolfhound, Irish',
            'Wolfshund',
            'Wolfshund, Irischer',
            'Wäller',
            'Zavod',
            'Zwerghund, Russischer',
            'Zwerghund, Walisischer',
            'Zwergspaniel, Russischer',
            'Ätnahund'
        ],
        pferd: [
            'Mischling',
            'Hannoveraner',
            'Oldenburger',
            'Quarter Horse',
            'Islandpferd',
            'Deutsches Sportpferd',
            'Pony',
            'Haflinger',
            'Westfale',
            'Abtenauer',
            'Achal Tekkiner',
            'Achetta',
            'Aegidienberger',
            'Albino',
            'Alt-Oldenburger',
            'Altwürttemberger',
            'Altér Real',
            'American Cream and White',
            'American Cream Draft Horse',
            'American Saddlebred Horse',
            'American Standardbred',
            'Andalusier',
            'Anglo-Araber',
            'Anglo-Araber, Französischer',
            'Anglo-Araber, Polnischer',
            'Anglo-Araber, Sardischer',
            'Anglo-Araber, Spanischer',
            'Anglo-Argentino',
            'Anglo-Donpferd',
            'Anglo-Kabardiner',
            'Anglo-Karatschaever',
            'Anglo-Normanne',
            'Appaloosa',
            'Appaloosa Sport Horse',
            'Ara-Appaloosa',
            'Araber',
            'Araber, Hispano',
            'Araber, Shagya',
            'Araber, Syrischer',
            'Araber, Vollblut-',
            'Araber-Berber',
            'Araberpinto',
            'Arabisches Partbred',
            'Arabo-Haflinger',
            'Arabofriese',
            'Ardenner',
            'Ardenner, Lettischer',
            'Ardenner, Russischer',
            'Ardenner, Schwedischer',
            'Ariègois',
            'Arravani',
            'Asil-Araber',
            'Aveligneser',
            'Baden-Württemberger',
            'Bardigiano',
            'Belgier',
            'Berber',
            'Bosniake',
            'Boulonnais',
            'Brabanter',
            'Bretone',
            'Budjonny',
            'Burgenländer',
            'Camargue-Pferd',
            'Canadian Cutting Horse',
            'Canadian Horse',
            'Cavallo della Madonna',
            'Cavalo Portugues de Desperto',
            'Charolais Halbblut',
            'Cheval de Selle Francais',
            'Clydesdale',
            'Cob',
            'Cob Normand',
            'Colorado Ranger',
            'Comtois',
            'Criollo',
            'Curly Horse',
            'Curly Horse, American Bashkir',
            'Danubisches Pferd',
            'Dolepferd',
            'Donpferd',
            'Dülmener',
            'Dülmener Wildpferd',
            'Einsiedler',
            'Esel',
            'Estnisches Pferd',
            'Falabella',
            'Finnpferd',
            'Fjordpferd, Norwegisches',
            'Flamländer',
            'Foxtrotter, Missouri',
            'Foxtrotter, Österreichischer',
            'Frederiksborger',
            'Freiberger',
            'Friese',
            'Furioso-North-Star',
            'Gebirgspferd, Bosnisches',
            'Gebirgspferd, Mazedonisches',
            'Gelderländer',
            'Gidran',
            'Golden American Saddlebred',
            'Groninger Pferd',
            'Großpolnische Rasse',
            'Gudbrandsdaler',
            'Hack',
            'Hackney',
            'Haflinger, Edelblut',
            'Halbblut, Arabisches',
            'Halbblut, Limousin',
            'Hessen-Nassauer',
            'Hispano',
            'Holsteiner',
            'Hunter, Englischer',
            'Hunter, Irischer',
            'Huzule',
            'Irish Cob',
            'Irish Draught Horse',
            'Irish Sport Horse',
            'Jomud',
            'Jütländer',
            'Kabardiner',
            'Kaltblut',
            'Kaltblut, Altmärkisches',
            'Kaltblut, Belgisches',
            'Kaltblut, CSFR-',
            'Kaltblut, Italienisches',
            'Kaltblut, Lettisches',
            'Kaltblut, Litauisches',
            'Kaltblut, Mecklenburger',
            'Kaltblut, Niederländisches',
            'Kaltblut, Rheinisch-Deutsches',
            'Kaltblut, Rheinisch-Westfälisches',
            'Kaltblut, Russisches',
            'Kaltblut, Schwarzwälder',
            'Kaltblut, Slowenisches',
            'Kaltblut, Sächsisch-Thüringisches',
            'Kaltblut, Süddeutsches',
            'Kaltblut, Tschechisches',
            'Kaltblut, Ungarisches',
            'Kaltblutaraber, Skandinavischer',
            'Karabagh',
            'Kartäuser',
            'Kentucky Mountain Saddle Horse',
            'Kinsky-Pferd',
            'Kisberer',
            'Kladruber',
            'Kleinpferd',
            'Knabstrupper',
            'Konik Polski',
            'Kopczyk-Podlaski',
            'Kustanaier',
            'Leonharder',
            'Leutstettener',
            'Lewitzer',
            'Lipizzaner',
            'Lokaier',
            'Lusitano',
            'Malopolska',
            'Mangalarga Marchador',
            'Maremmano',
            'Maulesel',
            'Maultier',
            'Menorquiner',
            'Miniature Horse, American',
            'Miniaturpferd',
            'Mischblut',
            'Morgan Horse',
            'Moulassier',
            'Muli',
            'Muraközer',
            'Murgese',
            'Mustang',
            'Mustang, Kiger',
            'Mustang, Spanischer',
            'Nonius',
            'Nord-Adenner',
            'Norfolk Trotter',
            'Noriker',
            'Normannischer Cob',
            'Orlow-Traber',
            'Ostbulgare',
            'Ostfriese',
            'Ostpreuße',
            'Paint Horse',
            'Palomino',
            'Panje Pferd',
            'Paso Fino',
            'Paso Peruano',
            'Percheron',
            'Perser',
            'Peruano Argentino de Paso',
            'Pfalz-Ardenner',
            'Pintabian',
            'Pintarab',
            'Pinto',
            'Poitevin',
            'Polopferd, Deutsches',
            'Polopony',
            'Polopony, Argentinisches',
            'Poney Francais de Selle',
            'Pony of the Americas',
            'Pony, American Shetland',
            'Pony, Arenberg-Nordkirchener',
            'Pony, British Riding',
            'Pony, Connemara',
            'Pony, Dartmoor',
            'Pony, Deutsches Classic',
            'Pony, Deutsches Part-Bred Shetland',
            'Pony, Exmoor',
            'Pony, Fell',
            'Pony, Galicisches',
            'Pony, Gotland',
            'Pony, Highland',
            'Pony, Kaspisches',
            'Pony, Lehmkuhlener',
            'Pony, Minishetland',
            'Pony, Mongolen',
            'Pony, Mérens',
            'Pony, Neufundland',
            'Pony, New Forest',
            'Pony, Nigerianisches',
            'Pony, Nordkirchener',
            'Pony, Pottok',
            'Pony, Quarter',
            'Pony, Sardisches',
            'Pony, Shetland',
            'Pony, Tigerscheck',
            'Pony, Welsh',
            'Pony, Zwerg-',
            'Pura Raza Espanola',
            'Quarab',
            'Quarter Horse, American',
            'Racking Horse',
            'Reitpferd, Deutsches',
            'Reitpferd, Französisches',
            'Reitpferd, Italienisches',
            'Reitpferd, Kleines Deutsches',
            'Reitpferd, Russisches',
            'Reitpferd, Thüringer',
            'Reitpony, Deutsches',
            'Reitpony, Englisches',
            'Reitpony, Französisches',
            'Reitpony, Niederländisches',
            'Rocky Mountain Pferd',
            'Rottaler',
            'Salerner',
            'Sardisches Pferd',
            'Sarvarer',
            'Schleswiger',
            'Schwarzwälder Fuchs',
            'Sella Italiano',
            'Selle Argentino',
            'Selle Francais',
            'Senner',
            'Shire Horse',
            'Sizilianer',
            'Slaski',
            'Sonstige Pferderasse',
            'Sorraia',
            'Spanish-Norman Horse',
            'Sportpferd, Irisches',
            'Sportpferd, Italienisches',
            'Sportpferd, Portugiesisches',
            'Sportpferd, Ungarisches',
            'Spotted Saddle Horse',
            'Suffolk Punch',
            'Tennessee Walking Horse',
            'Tersker',
            'Thoroughbred',
            'Tinker',
            'Tiro Pesante Rapido',
            'Torgelsches Pferd',
            'Torisches Pferd',
            'Torisker',
            'Traber',
            'Traber, Andalusischer',
            'Traber, Deutscher',
            'Traber, Dole',
            'Traber, Französischer',
            'Traber, Metis',
            'Traber, Russischer',
            'Traber, Töltender',
            'Trait du Nord',
            'Trakehner',
            'Trotteur Francais',
            'Tschenerani',
            'Tuigpaard',
            'Ukrainer',
            'Vollblut',
            'Vollblut, Anglo-Arabisches',
            'Vollblut, Arabisches',
            'Vollblut, Englisches',
            'Warmblut',
            'Warmblut, Bayerisches',
            'Warmblut, Belgisches',
            'Warmblut, Brandenburger',
            'Warmblut, Britisches',
            'Warmblut, CSFR-',
            'Warmblut, Dänisches',
            'Warmblut, Hessisches',
            'Warmblut, Holländisches',
            'Warmblut, Lettisches',
            'Warmblut, Littauer',
            'Warmblut, Mecklenburger',
            'Warmblut, Niederländisches',
            'Warmblut, Polnisches',
            'Warmblut, Rheinisches',
            'Warmblut, Sachsen-Anhaltiner',
            'Warmblut, Schlesisches',
            'Warmblut, Schwedisches',
            'Warmblut, Schweizer',
            'Warmblut, Schweres',
            'Warmblut, Slowakisches',
            'Warmblut, Sächsisch-Thüringisches Schweres',
            'Warmblut, Tschechisches',
            'Warmblut, Ungarisches',
            'Warmblut, Württemberger',
            'Warmblut, Württemberger Schweres',
            'Warmblut, Zweibrücker',
            'Warmblut, Österreichisches',
            'Welsh Part Bred',
            'Wielkopolski',
            'Württemberger',
            'Zugpferd, Italienisches',
            'Zwergpony, Argentinisches'
        ]
    };

    // PLZ input validation and city display
    if (plzInput) {
        plzInput.addEventListener('input', function() {
            const plz = this.value;
            if (plz.length === 5 && plzCityMap[plz]) {
                // Could display city name here if needed
                // PLZ validation successful
            }
        });
    }

    // Function to update breed dropdown based on selected animal category
    function updateBreedOptions(animalType) {
        if (!rasseSelect) return;
        
        // Clear existing options
        rasseSelect.innerHTML = '';
        
        // Get breeds for selected animal type
        const breeds = breedData[animalType] || [];
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        if (animalType === 'katze') {
            defaultOption.textContent = 'Rasse auswählen...';
        } else if (animalType === 'hund') {
            defaultOption.textContent = 'Rasse auswählen...';
        } else if (animalType === 'pferd') {
            defaultOption.textContent = 'Rasse auswählen...';
        }
        defaultOption.selected = true;
        rasseSelect.appendChild(defaultOption);
        
        // Add breed options
        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.toLowerCase().replace(/[^a-z0-9]/g, '_');
            option.textContent = breed;
            rasseSelect.appendChild(option);
        });
    }

    // Animal category change handler
    if (tierKategorieSelect) {
        tierKategorieSelect.addEventListener('change', function() {
            const selectedAnimal = this.value;
            updateBreedOptions(selectedAnimal);
            
            // Update housing question text based on animal type
            updateHousingText(selectedAnimal);
        });
        
        // Initialize breed options on page load
        updateBreedOptions(tierKategorieSelect.value);
    }

    // Function to update housing question text based on animal type
    function updateHousingText(animalType) {
        const haltungTitle = document.getElementById('haltungTitle');
        const indoorText = document.getElementById('indoorText');
        const outdoorText = document.getElementById('outdoorText');
        
        if (haltungTitle && indoorText && outdoorText) {
            if (animalType === 'katze') {
                haltungTitle.textContent = 'Wie wird Ihre Katze gehalten?';
                indoorText.textContent = 'ausschließlich in der Wohnung';
                outdoorText.textContent = 'Freigänger';
            } else if (animalType === 'hund') {
                haltungTitle.textContent = 'Wie wird Ihr Hund gehalten?';
                indoorText.textContent = 'ausschließlich im Haus/Wohnung';
                outdoorText.textContent = 'mit Gartenfreilauf/Auslauf';
            } else if (animalType === 'pferd') {
                haltungTitle.textContent = 'Wie wird Ihr Pferd gehalten?';
                indoorText.textContent = 'Stallhaltung';
                outdoorText.textContent = 'Koppel-/Weidehaltung';
            }
        }
    }

    // Handle health problems radio button change
    gesundheitsproblemeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'ja' && behandlungsFrage) {
                behandlungsFrage.style.display = 'block';
                // Also show the disease list
                if (krankheitenListe) {
                    krankheitenListe.style.display = 'block';
                }
            } else if (behandlungsFrage) {
                behandlungsFrage.style.display = 'none';
                // Hide the disease list
                if (krankheitenListe) {
                    krankheitenListe.style.display = 'none';
                    // Reset disease list radio buttons
                    const diseaseRadios = document.querySelectorAll('input[name="spezielle_krankheiten"]');
                    diseaseRadios.forEach(radio => radio.checked = false);
                }
                // Reset all checkboxes when hiding the question
                const behandlungCheckboxes = document.querySelectorAll('input[name="neue_behandlung"]');
                behandlungCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = false;
                });
                // Hide operation count
                if (operationAnzahl) {
                    operationAnzahl.style.display = 'none';
                }
                // Remove grayed styling
                document.querySelectorAll('.checkbox-option').forEach(option => {
                    option.classList.remove('grayed-option');
                });
            }
        });
    });

    // Handle treatment checkbox interactions
    if (keinBesuchCheckbox) {
        keinBesuchCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Disable and uncheck other options
                if (heilbehandlungCheckbox) {
                    heilbehandlungCheckbox.checked = false;
                    heilbehandlungCheckbox.disabled = true;
                    heilbehandlungCheckbox.parentElement.classList.add('grayed-option');
                }
                if (operationCheckbox) {
                    operationCheckbox.checked = false;
                    operationCheckbox.disabled = true;
                    operationCheckbox.parentElement.classList.add('grayed-option');
                }
                // Hide operation count
                if (operationAnzahl) {
                    operationAnzahl.style.display = 'none';
                }
            } else {
                // Re-enable other options
                if (heilbehandlungCheckbox) {
                    heilbehandlungCheckbox.disabled = false;
                    heilbehandlungCheckbox.parentElement.classList.remove('grayed-option');
                }
                if (operationCheckbox) {
                    operationCheckbox.disabled = false;
                    operationCheckbox.parentElement.classList.remove('grayed-option');
                }
            }
        });
    }

    // Handle operation checkbox
    if (operationCheckbox) {
        operationCheckbox.addEventListener('change', function() {
            if (this.checked) {
                if (operationAnzahl) {
                    operationAnzahl.style.display = 'block';
                }
            } else {
                if (operationAnzahl) {
                    operationAnzahl.style.display = 'none';
                }
            }
        });
    }

    // Prevent other checkboxes when "kein Besuch" is selected
    if (heilbehandlungCheckbox) {
        heilbehandlungCheckbox.addEventListener('change', function() {
            if (this.checked && keinBesuchCheckbox && keinBesuchCheckbox.checked) {
                keinBesuchCheckbox.checked = false;
                // Re-enable this checkbox
                this.disabled = false;
                this.parentElement.classList.remove('grayed-option');
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form and show errors
            const isValid = validateFormWithErrors();
            
            if (isValid) {
                // Get form data
                const formData = new FormData(form);
                const data = {};
                
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }

                // Form validation successful - data collected
                
                // Show a simple alert for now
                alert('Vielen Dank! Ihre Anfrage wurde erfasst. Sie werden nun zu den Tarifen weitergeleitet.');
                
                // Here you would normally send the data to a server
                // or show a results page
            }
        });
    }

    // Enhanced form validation with error display
    function validateFormWithErrors() {
        let isValid = true;
        
        // Clear all previous errors
        clearAllErrors();
        
        // Validate PLZ
        const plz = document.getElementById('plz');
        if (!plz || !plz.value || !isValidPLZ(plz.value)) {
            showError('plzError', 'plz');
            isValid = false;
        }
        
        // Validate birth date
        const geburtsdatum = document.getElementById('geburtsdatum');
        if (!geburtsdatum || !geburtsdatum.value) {
            showError('geburtsdatumError', 'geburtsdatum');
            isValid = false;
        } else {
            // Check if the date is in the future
            const selectedDate = new Date(geburtsdatum.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to beginning of today
            
            if (selectedDate > today) {
                showError('geburtsdatumFutureError', 'geburtsdatum');
                isValid = false;
            }
        }
        
        // Validate neutering status
        const kastriert = document.querySelector('input[name="kastriert"]:checked');
        if (!kastriert) {
            showError('kastriertError', 'kastriert');
            isValid = false;
        }
        
        // Validate housing method
        const haltung = document.querySelector('input[name="haltung"]:checked');
        if (!haltung) {
            showError('haltungError', 'haltung');
            isValid = false;
        }
        
        // Validate health problems
        const gesundheitsprobleme = document.querySelector('input[name="gesundheitsprobleme"]:checked');
        if (!gesundheitsprobleme) {
            showError('gesundheitsproblemeError', 'gesundheitsprobleme');
            isValid = false;
        }
        
        return isValid;
    }

    // Show error message
    function showError(errorId, fieldName) {
        const errorBox = document.getElementById(errorId);
        
        if (errorBox) {
            errorBox.classList.add('show');
            
            // Add field error styling
            const fieldElement = document.getElementById(fieldName) || 
                                document.querySelector(`input[name="${fieldName}"]`) ||
                                document.querySelector(`select[name="${fieldName}"]`);
            
            if (fieldElement) {
                const parentElement = fieldElement.closest('.form-question, .date-input-container, .inline-form');
                if (parentElement) {
                    parentElement.classList.add('field-error');
                }
            }
        }
    }

    // Clear all errors
    function clearAllErrors() {
        const errorBoxes = document.querySelectorAll('.error-box');
        errorBoxes.forEach(box => {
            box.classList.remove('show');
        });
        
        const fieldErrors = document.querySelectorAll('.field-error');
        fieldErrors.forEach(field => {
            field.classList.remove('field-error');
        });
    }

    // Simple form validation (for submit button state)
    function validateForm() {
        const geburtsdatum = document.getElementById('geburtsdatum');
        const kastriert = document.querySelector('input[name="kastriert"]:checked');
        const haltung = document.querySelector('input[name="haltung"]:checked');
        const gesundheitsprobleme = document.querySelector('input[name="gesundheitsprobleme"]:checked');

        return geburtsdatum && geburtsdatum.value && kastriert && haltung && gesundheitsprobleme;
    }

    // Enable/disable submit button based on form completion
    function updateSubmitButton() {
        if (submitButton) {
            // Don't disable the button - let validation happen on submit
            // submitButton.disabled = !validateForm();
        }
    }

    // Add change listeners to form fields
    if (form) {
        const formFields = form.querySelectorAll('input, select');
        formFields.forEach(field => {
            field.addEventListener('change', updateSubmitButton);
            field.addEventListener('input', updateSubmitButton);
            
            // Clear errors when user interacts with fields
            field.addEventListener('focus', function() {
                clearFieldError(this);
            });
            
            field.addEventListener('change', function() {
                clearFieldError(this);
                // Real-time validation for birth date
                if (this.id === 'geburtsdatum' && this.value) {
                    validateBirthDateRealTime(this);
                }
            });
            
            field.addEventListener('input', function() {
                clearFieldError(this);
                // Real-time validation for birth date
                if (this.id === 'geburtsdatum' && this.value) {
                    validateBirthDateRealTime(this);
                }
                // Real-time validation for PLZ
                if (this.id === 'plz' && this.value) {
                    validatePLZRealTime(this);
                }
            });
        });
    }

    // PLZ validation function
    function isValidPLZ(plz) {
        // German postal codes are 5 digits
        const plzPattern = /^\d{5}$/;
        return plzPattern.test(plz);
    }

    // Real-time PLZ validation
    function validatePLZRealTime(plzField) {
        // Clear any existing PLZ errors first
        const plzError = document.getElementById('plzError');
        if (plzError) plzError.classList.remove('show');
        
        // Remove field error styling
        const parentElement = plzField.closest('.form-question, .date-input-container, .inline-form');
        if (parentElement) {
            parentElement.classList.remove('field-error');
        }
        
        // Only show error if PLZ is invalid (and has some length to avoid showing error while typing)
        if (plzField.value.length >= 5 && !isValidPLZ(plzField.value)) {
            showError('plzError', 'plz');
        }
    }

    // Real-time birth date validation
    function validateBirthDateRealTime(dateField) {
        const selectedDate = new Date(dateField.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of today
        
        // Clear any existing birth date errors first
        const geburtsdatumError = document.getElementById('geburtsdatumError');
        const geburtsdatumFutureError = document.getElementById('geburtsdatumFutureError');
        if (geburtsdatumError) geburtsdatumError.classList.remove('show');
        if (geburtsdatumFutureError) geburtsdatumFutureError.classList.remove('show');
        
        // Remove field error styling
        const parentElement = dateField.closest('.form-question, .date-input-container, .inline-form');
        if (parentElement) {
            parentElement.classList.remove('field-error');
        }
        
        // Only show error if date is in the future
        if (selectedDate > today) {
            showError('geburtsdatumFutureError', 'geburtsdatum');
        }
    }

    // Clear error for specific field when user interacts with it
    function clearFieldError(field) {
        const fieldName = field.name || field.id;
        let errorId = null;
        
        // Map field names to error IDs
        switch(fieldName) {
            case 'plz':
                errorId = 'plzError';
                break;
            case 'geburtsdatum':
                // Clear both birth date errors
                const geburtsdatumError = document.getElementById('geburtsdatumError');
                const geburtsdatumFutureError = document.getElementById('geburtsdatumFutureError');
                if (geburtsdatumError) geburtsdatumError.classList.remove('show');
                if (geburtsdatumFutureError) geburtsdatumFutureError.classList.remove('show');
                break;
            case 'kastriert':
                errorId = 'kastriertError';
                break;
            case 'haltung':
                errorId = 'haltungError';
                break;
            case 'gesundheitsprobleme':
                errorId = 'gesundheitsproblemeError';
                break;
        }
        
        // Hide the specific error
        if (errorId) {
            const errorBox = document.getElementById(errorId);
            if (errorBox) {
                errorBox.classList.remove('show');
            }
            
            // Remove field error styling from parent element
            const parentElement = field.closest('.form-question, .date-input-container, .inline-form');
            if (parentElement) {
                parentElement.classList.remove('field-error');
            }
        }
    }

    // Number input +/- button functionality
    const increaseBtn = document.getElementById('increaseBtn');
    const decreaseBtn = document.getElementById('decreaseBtn');
    const numberInput = document.getElementById('anzahl_operationen');

    if (increaseBtn && decreaseBtn && numberInput) {
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(numberInput.value) || 1;
            numberInput.value = currentValue + 1;
            updateSubmitButton();
        });

        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(numberInput.value) || 1;
            if (currentValue > 1) {
                numberInput.value = currentValue - 1;
                updateSubmitButton();
            }
        });

        // Ensure minimum value is 1
        numberInput.addEventListener('input', function() {
            if (this.value < 1) {
                this.value = 1;
            }
            updateSubmitButton();
        });
    }

    // Initial button state
    updateSubmitButton();
});