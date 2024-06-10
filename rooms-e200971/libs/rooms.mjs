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
    return getSites()
        .then(sites => {
            let promises = sites.map(site => {
                return new Promise((resolve, reject) => {
                    let data = { siteCode: site.siteCode };
                    fetch(`${ROOMS_URL}`, { method: 'POST', body: JSON.stringify(data) })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`${response.status} : ${response.statusText}`);
                            }
                        })
                        .then(result => {
                            site.rooms = result.map(item => new Room(item));
                            resolve(site);
                        })
                        .catch(error => {
                            console.log(error);
                            site.rooms = []
                            resolve(site);
                        });
                });
            });

            return Promise.all(promises);
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



