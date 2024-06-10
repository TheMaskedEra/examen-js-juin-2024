export {Room, Site, getSites, getRooms}
const ROOMS_URL = 'https://dartagnan.cg.helmo.be/~p150107/js2/rooms/rooms.php';
class Room {
    constructor({room, roomTypeCode, nbrPlaces}) {
        this.room = room;
        this.roomTypeCode = roomTypeCode;
        this.nbrPlaces = nbrPlaces;
    }

    get typeRoom() {
        switch (this.roomTypeCode) {
            case 'A': return "Auditoire";
            case 'C': return "Classe";
            case 'I': return "Laboratoire informatique";
            case 'L': return "Laboratoire";
            case 'P': return "Salle polyvalente";
            default: return "Non spécifié";
        }
    }
}

class Site {
    constructor({siteCode, siteName, rooms} = []) {
        this.siteCode = siteCode;
        this.siteName = siteName;
        this.rooms = rooms.map(item => new Room(item));
    }

    pushRooms(...rooms) {
        let nbrOfRoomsAdded = 0;
        for (let currentRoom of rooms) {
            let exists = this.rooms.find(room => room.room === currentRoom.room);
            if (exists !== undefined) {
                continue;
            }
            nbrOfRoomsAdded++;
            this.rooms.push(currentRoom);
        }

        return nbrOfRoomsAdded;
    }

    removeRoom(roomName) {
        let index = this.rooms.findIndex(room => room.room === roomName);

        if (index !== -1) {
            this.rooms.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }
}

function getSites(){
    return new Promise((resolve, reject) => {
        fetch(`${ROOMS_URL}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status} : ${response.statusText}`);
                }
                return response.json();
            })
            .then(result => {
                const sites = result.map(item => new Site(item));
                resolve(sites);
            })
            .catch(error => reject(error));
    });
}

function getRooms(){
    let promises = [];
    return getSites()
        .then(sites => {
            for (let site of sites) {
                let data = { siteCode: site.siteCode };
                let roomPromise = fetch(ROOMS_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`${response.status} : ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(roomData => {
                        // Convertir les données de chambre en instances de Room
                        site.rooms = roomData.map(room => new Room(room));
                    });
                promises.push(roomPromise);
            }

            // Attendre que toutes les promesses se résolvent
            return Promise.all(promises);
        })
        .catch(error => {
            console.error("Une erreur s'est produite lors de la récupération des chambres :", error);
            return [];
        });
}

function renderSites(sites){
    
}

function renderSelectedRooms(site){
}

function loadSites(){
    
}

function clearCache(){
    
}



