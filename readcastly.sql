-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;


-- ---
-- Table 'Users'
--
-- ---

DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(10) NOT NULL,
  `first_name` VARCHAR(20) NOT NULL,
  `last_name` VARCHAR(20) NULL,
  `phone` VARCHAR(20) NOT NULL,
  `voice_pref` INTEGER(1) NULL,
  `avatar` VARCHAR(100) NOT NULL DEFAULT 'http://cdn.makeuseof.com/wp-content/uploads/2015/06/6_emoji.png?187d39  ',
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Sources'
--
-- ---

DROP TABLE IF EXISTS `Sources`;

CREATE TABLE `Sources` (
  `id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `homepage` VARCHAR(200) NOT NULL,
  `most_read` VARCHAR(200) NULL DEFAULT NULL,
  `image` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Articles'
--
-- ---

DROP TABLE IF EXISTS `Articles`;

CREATE TABLE `Articles` (
  `id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(200) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `author` VARCHAR(200) NULL,
  `publication_date` DATE NULL,
  `source_id` INTEGER(11) NOT NULL,
  `text` TEXT NOT NULL,
  `image` VARCHAR(200) NULL,
  `excerpt` TEXT NULL,
  `date_added` TIMESTAMP NOT NULL,
  `word_count` INTEGER(11) NOT NULL,
  `est_time` INTEGER(11) NULL,
  `likes` INTEGER(11) NULL DEFAULT 0,
  `conversions` INTEGER(11) NOT NULL DEFAULT 0,
  `created_by` INTEGER(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`source_id`) REFERENCES `Sources`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `Users`(`id`)
);


-- ---
-- Table 'Articles-Users'
--
-- ---

DROP TABLE IF EXISTS `Articles-Users`;

CREATE TABLE `Articles-Users` (
  `id` INTEGER(11) NOT NULL,
  `article_id` INTEGER(11) NOT NULL,
  `user_id` INTEGER(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`article_id`) REFERENCES `Articles`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`)
);

-- ---
-- Table 'Sources-Users'
--
-- ---

DROP TABLE IF EXISTS `Sources-Users`;

CREATE TABLE `Sources-Users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `source_id` INTEGER(11) NOT NULL,
  `user_id` INTEGER(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`source_id`) REFERENCES `Sources`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`)
);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Articles` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Sources` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Articles-Users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Sources-Users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Articles` (`id`,`url`,`title`,`author`,`publication_date`,`source_id`,`text`,`image`,`excerpt`,`date_added`,`word_count`,`est_time`,`likes`,`conversions`,`created_by`) VALUES
-- ('','','','','','','','','','','','','','','');
-- INSERT INTO `Users` (`id`,`email`,`password`,`first_name`,`last_name`,`avatar`) VALUES
-- ('','','','','','');
-- INSERT INTO `Sources` (`id`,`name`,`homepage`,`most_read`,`image`) VALUES
-- ('','','','','');
-- INSERT INTO `Articles-Users` (`id`,`article_id`,`user_id`) VALUES
-- ('','','');
-- INSERT INTO `Sources-Users` (`id`,`source_id`,`user_id`) VALUES
-- ('','','');