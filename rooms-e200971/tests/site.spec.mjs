import {Room, Site} from '../libs/rooms.mjs';

import {expect} from 'chai';

describe('Site', function() {
    describe('sitePush', function() {
        it('Sans valeur', function() {
           let site = new Site({siteCode : 'CG', siteName: 'Campus Guillemins', rooms: []});
           let nbrOfRoomsPushed = site.pushRooms();
           expect(nbrOfRoomsPushed).to.equal(0);
           let roomsArray = site.rooms;
           expect(roomsArray.length).to.equal(0);
        });

        it('Ajout de plusieurs valeurs sans doublons', function() {
            let site = new Site({siteCode : 'CG', siteName: 'Campus Guillemins', rooms: []});
            let room1 = new Room({room: 'IL45', roomTypeCode: 'L', nbrPlaces: 24});
            let room2 = new Room({room : "IL46", roomTypeCode: 'L', nbrPlaces: 24});

            let nbrOfRoomsPushed = site.pushRooms(room1, room2);
            expect(nbrOfRoomsPushed).to.be.equal(2);

            let room1Added = site.rooms[0];
            let room2Added = site.rooms[1];

            expect(room1Added.room).to.equal(room1.room);
            expect(room2Added.room).to.equal(room2.room);
            expect(room1Added.roomTypeCode).to.equal(room1.roomTypeCode);
            expect(room2Added.roomTypeCode).to.equal(room2.roomTypeCode);
            expect(room1Added.nbrPlaces).to.equal(room1.nbrPlaces);
            expect(room2Added.nbrPlaces).to.equal(room2.nbrPlaces);
        });

        it('Ajout de plusieurs valeurs avec doublons', function() {
            let site = new Site({siteCode : 'CG', siteName: 'Campus Guillemins', rooms: []});
            let room1 = new Room({room: 'IL45', roomTypeCode: 'L', nbrPlaces: 24});
            let room2 = new Room({room : "IL45", roomTypeCode: 'L', nbrPlaces: 24});

            let nbrOfRoomsPushed = site.pushRooms(room1, room2);
            expect(nbrOfRoomsPushed).to.be.equal(1);

            let room1Added = site.rooms[0];
            let room2Added = site.rooms[1];

            expect(room1Added.room).to.equal(room1.room);
            expect(room1Added.roomTypeCode).to.equal(room1.roomTypeCode);
            expect(room1Added.nbrPlaces).to.equal(room1.nbrPlaces);
            expect(room2Added).to.be.undefined;
        });
    });
});