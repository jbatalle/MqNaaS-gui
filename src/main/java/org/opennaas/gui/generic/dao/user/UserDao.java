package org.opennaas.gui.generic.dao.user;

import org.opennaas.gui.generic.dao.Dao;
import org.opennaas.gui.generic.entity.User;

import org.springframework.security.core.userdetails.UserDetailsService;


public interface UserDao extends Dao<User, Long>, UserDetailsService
{

	User findByName(String name);

}