DROP TABLE IF EXISTS `classroom`;

CREATE TABLE `classroom` (
  `id` int NOT NULL,
  `room_number` int NOT NULL,
  `floor` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `room_number_UNIQUE` (`room_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `group`;

CREATE TABLE `group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(5) NOT NULL,
  `grade` int NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `start_year` int NOT NULL,
  `created_by` int NOT NULL,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `user_id_fk_idx` (`created_by`),
  CONSTRAINT `user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `group_subject`;

CREATE TABLE `group_subject` (
  `id` int NOT NULL,
  `subject_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `subject_id_fk_idx` (`subject_id`),
  KEY `group_id_fk_idx` (`group_id`),
  CONSTRAINT `fk_group_subject_group_group_id` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`),
  CONSTRAINT `fk_group_subject_subject_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `journal`;

CREATE TABLE `journal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_id` int NOT NULL,
  `student_id` int NOT NULL,
  `mark` int DEFAULT NULL,
  `date` datetime NOT NULL,
  `teacher_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `teacher_id_idx` (`teacher_id`),
  KEY `student_id_fk_idx` (`student_id`),
  KEY `subject_id_fk_idx` (`subject_id`),
  CONSTRAINT `fk_journal_student_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `fk_journal_subject_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`),
  CONSTRAINT `fk_journal_teacher_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `student`;

CREATE TABLE `student` (
  `id` int NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `group_id` int NOT NULL,
  `birth_year` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `group_id_idx` (`group_id`),
  CONSTRAINT `fk_student_group_group_id` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `subject`;

CREATE TABLE `subject` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `hours` int NOT NULL,
  `required` tinyint DEFAULT NULL,
  `classroom_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `classroom_id_idx` (`classroom_id`),
  CONSTRAINT `fk_subject_classroom_ classroom_id` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `teacher`;

CREATE TABLE `teacher` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `login` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `login_UNIQUE` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
