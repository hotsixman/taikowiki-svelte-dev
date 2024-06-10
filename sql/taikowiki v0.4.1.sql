-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- 생성 시간: 24-06-10 10:17
-- 서버 버전: 10.4.32-MariaDB
-- PHP 버전: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `taikowiki`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `ban/ip`
--

CREATE TABLE `ban/ip` (
  `order` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ip` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `dani`
--

CREATE TABLE `dani` (
  `order` int(11) NOT NULL,
  `version` text NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `diffchart`
--

CREATE TABLE `diffchart` (
  `order` int(11) NOT NULL,
  `name` text NOT NULL,
  `level` tinyint(4) DEFAULT NULL,
  `type` tinytext DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `log`
--

CREATE TABLE `log` (
  `order` int(11) NOT NULL,
  `UUID` text DEFAULT NULL,
  `ip` tinytext NOT NULL,
  `path` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `song`
--

CREATE TABLE `song` (
  `songNo` tinytext NOT NULL,
  `order` int(11) NOT NULL,
  `title` text NOT NULL,
  `titleKo` text DEFAULT NULL,
  `aliasKo` text DEFAULT NULL,
  `titleEn` text DEFAULT NULL,
  `aliasEn` text DEFAULT NULL,
  `bpm` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`bpm`)),
  `bpmShiver` tinyint(1) NOT NULL,
  `version` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`version`)),
  `isAsiaBanned` tinyint(1) NOT NULL,
  `isKrBanned` tinyint(1) NOT NULL,
  `genre` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`genre`)),
  `artists` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`artists`)),
  `addedDate` bigint(20) DEFAULT NULL,
  `courses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`courses`)),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `song/request`
--

CREATE TABLE `song/request` (
  `order` int(11) NOT NULL,
  `UUID` text NOT NULL,
  `ip` text NOT NULL,
  `songNo` tinytext NOT NULL,
  `createdTime` bigint(20) NOT NULL,
  `type` tinytext NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `user/basic_data`
--

CREATE TABLE `user/basic_data` (
  `order` int(11) NOT NULL,
  `provider` text NOT NULL,
  `providerId` text NOT NULL,
  `registerTime` bigint(20) NOT NULL,
  `grade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `user/data`
--

CREATE TABLE `user/data` (
  `order` int(11) NOT NULL,
  `provider` text NOT NULL,
  `providerId` text NOT NULL,
  `nickname` tinytext NOT NULL,
  `UUID` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `ban/ip`
--
ALTER TABLE `ban/ip`
  ADD PRIMARY KEY (`order`);

--
-- 테이블의 인덱스 `dani`
--
ALTER TABLE `dani`
  ADD PRIMARY KEY (`order`);

--
-- 테이블의 인덱스 `diffchart`
--
ALTER TABLE `diffchart`
  ADD PRIMARY KEY (`order`);

--
-- 테이블의 인덱스 `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`order`);

--
-- 테이블의 인덱스 `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`order`);

--
-- 테이블의 인덱스 `song/request`
--
ALTER TABLE `song/request`
  ADD PRIMARY KEY (`order`),
  ADD KEY `createdTime` (`createdTime`);

--
-- 테이블의 인덱스 `user/basic_data`
--
ALTER TABLE `user/basic_data`
  ADD PRIMARY KEY (`order`);

--
-- 테이블의 인덱스 `user/data`
--
ALTER TABLE `user/data`
  ADD PRIMARY KEY (`order`),
  ADD UNIQUE KEY `UUID` (`UUID`) USING HASH;

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `ban/ip`
--
ALTER TABLE `ban/ip`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `dani`
--
ALTER TABLE `dani`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `diffchart`
--
ALTER TABLE `diffchart`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `log`
--
ALTER TABLE `log`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `song`
--
ALTER TABLE `song`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `song/request`
--
ALTER TABLE `song/request`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `user/basic_data`
--
ALTER TABLE `user/basic_data`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `user/data`
--
ALTER TABLE `user/data`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
