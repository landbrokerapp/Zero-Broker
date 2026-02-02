// Comprehensive Tamil Nadu Cities and Localities Data
// This includes major cities with detailed locality information

export interface LocalityDetail {
    name: string;
    subLocalities?: string[];
    pincode?: string;
}

export interface CityData {
    name: string;
    localities: LocalityDetail[];
    district?: string;
}

// Comprehensive Tamil Nadu Cities with Detailed Localities
export const tamilNaduCitiesDetailed: Record<string, LocalityDetail[]> = {
    'Chennai': [
        { name: 'Adyar', subLocalities: ['Thiruvanmiyur', 'Besant Nagar', 'Indira Nagar', 'Kasturba Nagar'] },
        { name: 'Velachery', subLocalities: ['Taramani', 'Vijayanagar', 'Phoenix Market City Area'] },
        { name: 'T Nagar', subLocalities: ['West Mambalam', 'Ashok Nagar', 'Kodambakkam'] },
        { name: 'Anna Nagar', subLocalities: ['Anna Nagar East', 'Anna Nagar West', 'Thirumangalam', 'Mogappair'] },
        { name: 'Ambattur', subLocalities: ['Ambattur Industrial Estate', 'Ambattur OT', 'Korattur'] },
        { name: 'Porur', subLocalities: ['Ramapuram', 'Mugalivakkam', 'Alapakkam', 'Gerugambakkam'] },
        { name: 'Madipakkam', subLocalities: ['Keelkattalai', 'Nanganallur', 'Palavanthangal'] },
        { name: 'Guindy', subLocalities: ['IIT Madras', 'Ekkatuthangal', 'Alandur'] },
        { name: 'Mylapore', subLocalities: ['Mandaveli', 'Luz', 'Abhiramapuram'] },
        { name: 'Perambur', subLocalities: ['Vyasarpadi', 'Sembium', 'Kolathur'] },
        { name: 'Pallavaram', subLocalities: ['Chromepet', 'Hasthinapuram', 'Zamin Pallavaram'] },
        { name: 'Tambaram', subLocalities: ['East Tambaram', 'West Tambaram', 'Selaiyur', 'Chitlapakkam'] },
        { name: 'Royapettah', subLocalities: ['Teynampet', 'Alwarpet', 'Mylapore'] },
        { name: 'Nungambakkam', subLocalities: ['Chetpet', 'Egmore', 'Kilpauk'] },
        { name: 'OMR (Old Mahabalipuram Road)', subLocalities: ['Sholinganallur', 'Perungudi', 'Thoraipakkam', 'Navalur', 'Kelambakkam'] },
        { name: 'ECR (East Coast Road)', subLocalities: ['Neelankarai', 'Injambakkam', 'Palavakkam', 'Akkarai'] },
        { name: 'Chrompet', subLocalities: ['St Thomas Mount', 'Meenambakkam', 'Tirusulam'] },
        { name: 'Medavakkam', subLocalities: ['Madipakkam', 'Jalladianpet', 'Kovilambakkam'] },
        { name: 'Vadapalani', subLocalities: ['Virugambakkam', 'Saligramam', 'KK Nagar'] },
        { name: 'Thiruvanmiyur', subLocalities: ['Neelankarai', 'Palavakkam', 'Kottivakkam'] },
    ],
    'Coimbatore': [
        { name: 'Saravanampatti', subLocalities: ['GKS Nagar', 'Janatha Nagar', 'Mani Nagar', 'Bankers Colony', 'Revenue Nagar', 'Sri Vigneshwara Nagar', 'Chitra Nagar'] },
        { name: 'Peelamedu', subLocalities: ['Hopes College', 'Lakshmi Mills', 'Ram Nagar', 'Avinashi Road'] },
        { name: 'RS Puram', subLocalities: ['Race Course', 'Sivananda Colony', 'DB Road', 'Ramnagar'] },
        { name: 'Gandhipuram', subLocalities: ['Cross Cut Road', 'Big Bazaar Street', 'Oppanakara Street'] },
        { name: 'Vadavalli', subLocalities: ['Maruthamalai Road', 'Thondamuthur Road', 'Vellalore'] },
        { name: 'Singanallur', subLocalities: ['Trichy Road', 'Ondipudur', 'Kurichi'] },
        { name: 'Thudiyalur', subLocalities: ['Vellakinar', 'Othakalmandapam', 'Narasimhanaickenpalayam'] },
        { name: 'Kovaipudur', subLocalities: ['Neelambur', 'Saibaba Colony', 'Sowripalayam'] },
        { name: 'Ganapathy', subLocalities: ['Kalapatti', 'Vilankurichi', 'Chinnavedampatti'] },
        { name: 'Ramanathapuram', subLocalities: ['Selvapuram', 'Sundarapuram', 'Podanur'] },
        { name: 'Saibaba Colony', subLocalities: ['Gandhipuram', 'Tatabad', 'Ram Nagar'] },
        { name: 'Ukkadam', subLocalities: ['Sungam', 'Koundampalayam', 'Varadharajapuram'] },
        { name: 'Kuniyamuthur', subLocalities: ['Velandipalayam', 'Kanuvai', 'Idigarai'] },
        { name: 'Kavundampalayam', subLocalities: ['Nanjundapuram', 'Vilankurichi', 'Kurumbapalayam'] },
    ],
    'Madurai': [
        { name: 'Anna Nagar', subLocalities: ['Bypass Road', 'Ponmeni', 'Harveypatti'] },
        { name: 'K Pudur', subLocalities: ['Thirunagar', 'Villapuram', 'Avaniyapuram'] },
        { name: 'Sellur', subLocalities: ['Meenakshi Nagar', 'Gomathipuram', 'Shenoy Nagar'] },
        { name: 'Simmakkal', subLocalities: ['Town Hall Road', 'Periyar Bus Stand Area'] },
        { name: 'SS Colony', subLocalities: ['Bypass Road', 'Madurai Kamaraj University Area'] },
        { name: 'Tiruppalai', subLocalities: ['Goripalayam', 'Perungudi', 'Othakadai'] },
        { name: 'Tirunagar', subLocalities: ['Pasumalai', 'Alagar Kovil Road'] },
        { name: 'Kalavasal', subLocalities: ['Vilangudi', 'Bibikulam', 'Arappalayam'] },
        { name: 'Arapalayam', subLocalities: ['Mattuthavani', 'Uthangudi'] },
    ],
    'Trichy': [
        { name: 'Thillai Nagar', subLocalities: ['Puthur', 'BHELTownship', 'Kailasapuram'] },
        { name: 'Srirangam', subLocalities: ['Thiruvanaikaval', 'Ammamandapam'] },
        { name: 'Cantonment', subLocalities: ['Salai Road', 'Lawsons Road'] },
        { name: 'KK Nagar', subLocalities: ['Panjapur', 'Crawford', 'Tennur'] },
        { name: 'Woraiyur', subLocalities: ['Somarasampettai', 'Navalpattu'] },
        { name: 'Lalgudi', subLocalities: ['Manikandam', 'Pullambadi'] },
        { name: 'Tiruvarambur', subLocalities: ['Senthaneerpuram', 'Navalpattu'] },
    ],
    'Salem': [
        { name: 'Alagapuram', subLocalities: ['Gugai', 'Ammapet', 'Meyyanur'] },
        { name: 'Fairlands', subLocalities: ['Swarnapuri', 'Hasthampatti', 'Suramangalam'] },
        { name: 'Suramangalam', subLocalities: ['Kitchipalayam', 'Kondalampatti'] },
        { name: 'Hasthampatti', subLocalities: ['Seeragapadi', 'Meyyanur'] },
        { name: 'Ammapet', subLocalities: ['Gugai', 'Narasothipatti'] },
        { name: 'Kondalampatti', subLocalities: ['Karuppur', 'Mallamooppampatti'] },
    ],
    'Tiruppur': [
        { name: 'Avinashi Road', subLocalities: ['Veerapandi', 'Mannarai', 'Kumaran Nagar'] },
        { name: 'Palladam Road', subLocalities: ['Chettipalayam', 'Vellakovil'] },
        { name: 'Dharapuram Road', subLocalities: ['Kangeyam', 'Uthukuli'] },
        { name: 'Kangayam Road', subLocalities: ['Vellakovil', 'Uthukuli'] },
    ],
    'Erode': [
        { name: 'Perundurai Road', subLocalities: ['Veerappanchatram', 'Chithode'] },
        { name: 'Sathy Road', subLocalities: ['Kavindapadi', 'Bhavani'] },
        { name: 'Bhavani', subLocalities: ['Anthiyur', 'Kodumudi'] },
        { name: 'Gobichettipalayam', subLocalities: ['Bhavanisagar', 'Sathyamangalam'] },
    ],
    'Vellore': [
        { name: 'Katpadi', subLocalities: ['Sathuvachari', 'Thorapadi', 'Kosapet'] },
        { name: 'Sathuvachari', subLocalities: ['Bagayam', 'Thottapalayam'] },
        { name: 'Gandhi Nagar', subLocalities: ['Officers Colony', 'CMC Campus'] },
        { name: 'Arcot', subLocalities: ['Ranipet', 'Walajapet'] },
    ],
    'Tirunelveli': [
        { name: 'Palayamkottai', subLocalities: ['Vannarpettai', 'Melapalayam', 'High Ground'] },
        { name: 'Pettai', subLocalities: ['Junction', 'Town Area'] },
        { name: 'Melapalayam', subLocalities: ['Reddiarpatti', 'Maharaja Nagar'] },
        { name: 'Tenkasi', subLocalities: ['Courtallam', 'Shencottai'] },
    ],
    'Thoothukudi': [
        { name: 'Spic Nagar', subLocalities: ['Harbour Area', 'Millerpuram'] },
        { name: 'Millerpuram', subLocalities: ['Meelavittan', 'Ettayapuram'] },
        { name: 'Meelavittan', subLocalities: ['Kovilpatti', 'Kayathar'] },
    ],
    'Hosur': [
        { name: 'SIPCOT Phase I', subLocalities: ['Industrial Area', 'Bagalur'] },
        { name: 'SIPCOT Phase II', subLocalities: ['Attibele Border', 'Denkanikottai Road'] },
        { name: 'Mathigiri', subLocalities: ['Rayakottai Road', 'Kelamangalam'] },
        { name: 'Zuzuvadi', subLocalities: ['Thally Road', 'Anchetty'] },
    ],
    'Kancheepuram': [
        { name: 'Sriperumbudur', subLocalities: ['Oragadam', 'Irungattukottai', 'Padappai'] },
        { name: 'Walajabad', subLocalities: ['Kattankolathur', 'Maraimalai Nagar'] },
        { name: 'Oragadam', subLocalities: ['SIPCOT', 'Industrial Area'] },
    ],
    'Thanjavur': [
        { name: 'Medical College Road', subLocalities: ['Palli Agraharam', 'Karanthai'] },
        { name: 'McDaniel Nagar', subLocalities: ['Srinivasapuram', 'Melattur'] },
        { name: 'Kumbakonam Road', subLocalities: ['Papanasam', 'Thiruvaiyaru'] },
    ],
    'Nagercoil': [
        { name: 'Kottar', subLocalities: ['Vadasery', 'Asaripallam'] },
        { name: 'Vadasery', subLocalities: ['Ozhuginasery', 'Chettikulam'] },
        { name: 'Ozhuginasery', subLocalities: ['Thuckalay', 'Marthandam'] },
    ],
    // Additional Major Cities
    'Karur': [
        { name: 'Thanthoni Road', subLocalities: ['Kovai Road', 'Jayankondam'] },
        { name: 'Vengamedu', subLocalities: ['Aravakurichi', 'Kulithalai'] },
    ],
    'Dindigul': [
        { name: 'Palani Road', subLocalities: ['Begampur', 'Gandhigram'] },
        { name: 'Batlagundu', subLocalities: ['Oddanchatram', 'Nilakottai'] },
    ],
    'Cuddalore': [
        { name: 'Old Town', subLocalities: ['Manjakuppam', 'Devanampattinam'] },
        { name: 'Neyveli', subLocalities: ['Panruti', 'Virudhachalam'] },
    ],
    'Kanyakumari': [
        { name: 'Nagercoil', subLocalities: ['Kottar', 'Vadasery'] },
        { name: 'Colachel', subLocalities: ['Muttom', 'Eraniel'] },
    ],
    'Namakkal': [
        { name: 'Tiruchengode', subLocalities: ['Rasipuram', 'Paramathi'] },
        { name: 'Kolli Hills', subLocalities: ['Semmedu', 'Vazhavanthi'] },
    ],
    'Pudukkottai': [
        { name: 'Gandhi Nagar', subLocalities: ['Annavasal', 'Aranthangi'] },
        { name: 'Thirumayam', subLocalities: ['Alangudi', 'Karambakudi'] },
    ],
    'Ramanathapuram': [
        { name: 'Paramakudi', subLocalities: ['Rameswaram', 'Mudukulathur'] },
        { name: 'Kadaladi', subLocalities: ['Mandapam', 'Thiruvadanai'] },
    ],
    'Sivaganga': [
        { name: 'Karaikudi', subLocalities: ['Devakottai', 'Manamadurai'] },
        { name: 'Kanadukathan', subLocalities: ['Chettinad', 'Thiruppathur'] },
    ],
    'Virudhunagar': [
        { name: 'Srivilliputtur', subLocalities: ['Rajapalayam', 'Sattur'] },
        { name: 'Aruppukottai', subLocalities: ['Sivakasi', 'Watrap'] },
    ],
    'Theni': [
        { name: 'Periyakulam', subLocalities: ['Bodinayakanur', 'Uthamapalayam'] },
        { name: 'Andipatti', subLocalities: ['Cumbum', 'Chinnamanur'] },
    ],
    'Krishnagiri': [
        { name: 'Hosur', subLocalities: ['Denkanikottai', 'Shoolagiri'] },
        { name: 'Pochampalli', subLocalities: ['Bargur', 'Uthangarai'] },
    ],
    'Dharmapuri': [
        { name: 'Palacode', subLocalities: ['Harur', 'Pennagaram'] },
        { name: 'Karimangalam', subLocalities: ['Morappur', 'Pappinaickenpatti'] },
    ],
    'Ariyalur': [
        { name: 'Jayankondam', subLocalities: ['Sendurai', 'Udayarpalayam'] },
        { name: 'Andimadam', subLocalities: ['Thirumanur', 'T.Palur'] },
    ],
    'Perambalur': [
        { name: 'Veppanthattai', subLocalities: ['Alathur', 'Kunnam'] },
        { name: 'Veppur', subLocalities: ['Elambalur', 'Valikandapuram'] },
    ],
    'Nagapattinam': [
        { name: 'Mayiladuthurai', subLocalities: ['Sirkali', 'Tharangambadi'] },
        { name: 'Vedaranyam', subLocalities: ['Kilvelur', 'Thirukkuvalai'] },
    ],
    'Tiruvarur': [
        { name: 'Mannargudi', subLocalities: ['Needamangalam', 'Thiruthuraipoondi'] },
        { name: 'Valangaiman', subLocalities: ['Koradachery', 'Kudavasal'] },
    ],
};

// Simple list for backward compatibility
export const tamilNaduCities: Record<string, string[]> = Object.entries(tamilNaduCitiesDetailed).reduce((acc, [city, localities]) => {
    acc[city] = localities.map(loc => loc.name);
    return acc;
}, {} as Record<string, string[]>);

export const localities = Object.values(tamilNaduCities).flat();

// Get all city names
export const getAllCityNames = (): string[] => {
    return Object.keys(tamilNaduCitiesDetailed).sort();
};

// Get localities for a city with sub-localities
export const getLocalitiesForCity = (city: string): LocalityDetail[] => {
    return tamilNaduCitiesDetailed[city] || [];
};

// Search localities across all cities
export const searchLocalities = (query: string): { city: string; locality: LocalityDetail }[] => {
    const results: { city: string; locality: LocalityDetail }[] = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(tamilNaduCitiesDetailed).forEach(([city, localities]) => {
        localities.forEach(locality => {
            if (locality.name.toLowerCase().includes(lowerQuery)) {
                results.push({ city, locality });
            }
            // Also search in sub-localities
            locality.subLocalities?.forEach(subLoc => {
                if (subLoc.toLowerCase().includes(lowerQuery)) {
                    results.push({ city, locality });
                }
            });
        });
    });

    return results;
};
