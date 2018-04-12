create database konkurencija;
use konkurencija;

create table users (
    id int(4) primary key auto_increment,
    balance int(4) not null default 0
);

insert into users values (null, 0);
select * from users;

delimiter $$

create procedure upVal(_id int, _val int)
begin
	set @current_balance = (select balance from users where id = _id);
	set @new_balance = @current_balance + _val;
	update users set balance = @new_balance where  id = _id;
end
$$

create procedure downVal(_id int, _val int)
begin
	set @current_balance = (select balance from users where id = _id);
	set @new_balance = @current_balance - _val;
	update users set balance = @new_balance where  id = _id;
end
$$

create procedure upValTransaction(_id int, _val int)
begin
	start transaction;
		set @current_balance = (select balance from users where id = _id);
		set @new_balance = @current_balance + _val;
		update users set balance = @new_balance where  id = _id;
	commit;
end
$$

create procedure downValTransaction(_id int, _val int)
begin
	start transaction;
		set @current_balance = (select balance from users where id = _id);
		set @new_balance = @current_balance - _val;
		update users set balance = @new_balance where  id = _id;
	commit;
end
$$

create procedure upValTransactionConsistent(_id int, _val int)
begin
	start transaction;
		set @current_balance = (select balance from users where id = _id for update);
		set @new_balance = @current_balance + _val;
		update users set balance = @new_balance where  id = _id;
	commit;
end
$$

create procedure downValTransactionConsistent(_id int, _val int)
begin
	start transaction;
		set @current_balance = (select balance from users where id = _id for update);
		set @new_balance = @current_balance - _val;
		update users set balance = @new_balance where  id = _id;
	commit;
end
$$

delimiter ;