export {Room, Site, getSites}
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
    constructor({siteCode, siteName, rooms}) {
        this.siteCode = siteCode;
        this.siteName = siteName;
        this.rooms = rooms;
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
        let x = this.rooms.find(room => room.name === roomName);
        return Boolean(x);
    }
}

function getSites(){
    let resultat = new Promise((resolve, reject) => {
        fetch(`${ROOMS_URL}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status} : ${response.statusText}`);
                }
                return response;
            })
            .then(response => {
                for (let siteResponse of response) {
                    let site = siteResponse.json();

                }
            })
            .catch(error => reject(error));
    });
}

function getRooms(){
    
}

function renderSites(sites){
    
}

function renderSelectedRooms(site){
}

function loadSites(){
    
}

function clearCache(){
    
}



