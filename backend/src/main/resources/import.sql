insert into member
values
    (nextval('member_seq'), '28a9260c-020e-4eb8-b88b-c05066157e50', 'testmember');
insert into room
values
    (nextval('room_seq'), '28a9260c-020e-4eb8-b88b-c05066157e50', '1dd490ee-7814-4c0d-9bdb-965836cd4eac', 'Morphological Room', null, 'DEMO Room', 'CREATED');
insert into mbparameter
values
    (nextval('mbparameter_seq'), (select id from room where roomid = '28a9260c-020e-4eb8-b88b-c05066157e50'), 'Parameter 1'),
    (nextval('mbparameter_seq'), (select id from room where roomid = '28a9260c-020e-4eb8-b88b-c05066157e50'), 'Parameter 2'),
    (nextval('mbparameter_seq'), (select id from room where roomid = '28a9260c-020e-4eb8-b88b-c05066157e50'), 'Parameter 3'),
    (nextval('mbparameter_seq'), (select id from room where roomid = '28a9260c-020e-4eb8-b88b-c05066157e50'), 'Parameter 4');

insert into realization
values
    (nextval('realization_seq'), (SELECT paramid FROM mbparameter where title = 'Parameter 1'), 'Realization 1-1'),
    (nextval('realization_seq'), (SELECT paramid FROM mbparameter where title = 'Parameter 1'), 'Realization 1-2'),
    (nextval('realization_seq'), (SELECT paramid FROM mbparameter where title = 'Parameter 1'), 'Realization 1-3'),
    (nextval('realization_seq'), (SELECT paramid FROM mbparameter where title = 'Parameter 2'), 'Realization 2-1'),
    (nextval('realization_seq'), (SELECT paramid FROM mbparameter where title = 'Parameter 2'), 'Realization 2-2'),
    (nextval('realization_seq'), (SELECT paramid FROM mbparameter where title = 'Parameter 3'), 'Realization 3-1'),
    (nextval('realization_seq'), (SELECT paramid FROM mbparameter where title = 'Parameter 3'), 'Realization 3-2'),
    (nextval('realization_seq'), (SELECT paramid FROM mbparameter where title = 'Parameter 3'), 'Realization 3-3'),
    (nextval('realization_seq'), (SELECT paramid FROM mbparameter where title = 'Parameter 4'), 'Realization 4-1');