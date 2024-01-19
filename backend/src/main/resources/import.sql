-- insert test data room

 insert into room (id,roomstate, roomid, room_type) values (1,true,'44fc47f1-ff37-4b2e-9a36-3ea50ce9063b','brainwritingroom');
 insert into room (id, roomstate, roomid, room_type) values (2,true,'7adc95e5-6fea-40a0-89ed-65247ae5a951','brainwriting');
 insert into room (id, roomstate, roomid, room_type) values (3,true,'44242d3f-ec79-4368-b419-0c100b88b33b','brainwriting');
 insert into room (id, roomstate, roomid, room_type) values (4,true,'86d96aca-4975-44e7-bf38-24e619b1c04e','brainwriting');

select * from member;
-- insert test data user

 insert into member (id, userid) values (1,'436737df-ea9e-455a-8e49-5e6a80bb77d8');
 insert into member (id, userid) values (2,'daf7c02d-9520-48cc-9261-5a5d132de295');
 insert into member (id, userid) values (3,'5aaa4993-0180-4fae-a83d-ba03c1d47bd7');

 insert into participation (id, member_id, room_id, sessionid) values (1,1,1,'0');
 insert into participation (id, member_id, room_id, sessionid) values (2,2,1,'0');
 insert into participation (id, member_id, room_id, sessionid) values (3,3,2,'0');

-- insert test data ideas

insert into idea (id, member_id, room_id, content)
values (1,1,1,'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam');

insert into idea (id, member_id, room_id, content)
values (2,2,1,'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam');

insert into idea (id, member_id, room_id, content)
values (3,1,1,'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam');

insert into idea (id, member_id, room_id, content)
values (4,1,1,'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam');

insert into idea (id, member_id, room_id, content)
values (5,2,1,'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam');