/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50720
 Source Host           : localhost:3306
 Source Schema         : vdsk

 Target Server Type    : MySQL
 Target Server Version : 50720
 File Encoding         : 65001

 Date: 22/05/2018 15:35:14
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_file
-- ----------------------------
DROP TABLE IF EXISTS `t_file`;
CREATE TABLE `t_file`  (
  `F_ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件的ID',
  `F_UserID` int(11) NULL DEFAULT NULL COMMENT '用户ID',
  `F_PID` int(11) NULL DEFAULT NULL COMMENT '父文件夹的ID，全部文件为0',
  `F_TypeID` int(11) NULL DEFAULT NULL COMMENT '文件种类的ID',
  `F_MD` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文件MD5摘要',
  `F_Guid` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文件的GUID，防止重复',
  `F_AccessUrl` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'CDN下载地址',
  `F_SourceUrl` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'COS下载地址',
  `F_LocalName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文件本身的名字',
  `F_RemoteName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文件在COS上的地址',
  `F_Size` int(11) NULL DEFAULT NULL COMMENT '文件的大小',
  `F_IsDir` int(1) NULL DEFAULT NULL COMMENT '是否是文件夹',
  `F_CreateTime` bigint(15) NULL DEFAULT NULL COMMENT '创建的时间的时间戳，精确到秒',
  PRIMARY KEY (`F_ID`) USING BTREE,
  INDEX `F_UserID`(`F_UserID`) USING BTREE,
  INDEX `F_TypeID`(`F_TypeID`) USING BTREE,
  CONSTRAINT `t_file_ibfk_1` FOREIGN KEY (`F_UserID`) REFERENCES `t_user` (`F_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_file_ibfk_2` FOREIGN KEY (`F_TypeID`) REFERENCES `t_type` (`F_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 146 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_file
-- ----------------------------
INSERT INTO `t_file` VALUES (3, 9, -1, 1, NULL, '62420548-ac2a-485c-b16e-486c3e3d1bd5', NULL, NULL, '全部文件', NULL, NULL, 1, 1520314910620);
INSERT INTO `t_file` VALUES (4, 10, -1, 1, NULL, 'd0571d56-751f-4d35-9b05-fec53401a23b', NULL, NULL, '全部文件', NULL, NULL, 1, 1520315632846);
INSERT INTO `t_file` VALUES (6, 9, 3, 1, NULL, 'd7821715-8abe-4ee8-b690-2b289661d3d7', NULL, NULL, 'music', NULL, NULL, 1, 1520345555562);
INSERT INTO `t_file` VALUES (71, 9, 70, 7, '0089e4631c71b8f7b167b0df82cb5219', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96', 'http://test-1255584620.file.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 'http://test-1255584620.cossh.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', '微机答案.zip', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 26839651, 0, 1520939392082);
INSERT INTO `t_file` VALUES (72, 9, 3, 1, NULL, '0880efc8-9c1d-416e-b237-48f300e5d0b8', NULL, NULL, '测试', NULL, NULL, 1, 1520939496262);
INSERT INTO `t_file` VALUES (90, 9, 3, 1, NULL, '4c632fbe-b7e0-42aa-9ce3-b60bc5e9e400', NULL, NULL, 'image', NULL, NULL, 1, 1521514337033);
INSERT INTO `t_file` VALUES (121, 9, 3, 1, NULL, '8d71edb8-9c60-4a1c-b218-6ddc1dea4cc8', NULL, NULL, '好的撒克鲁', NULL, NULL, 1, 1524043602770);
INSERT INTO `t_file` VALUES (124, 9, 3, 7, 'dacf168ce76ad65fb1159f4a9edc9aae', 'da864956-2950-4da6-ad37-9196f0eec5d2', 'http://test-1255584620.file.myqcloud.com/da864956-2950-4da6-ad37-9196f0eec5d2.sql', 'http://test-1255584620.cossh.myqcloud.com/da864956-2950-4da6-ad37-9196f0eec5d2.sql', 'checkin.sql', 'da864956-2950-4da6-ad37-9196f0eec5d2.sql', 6556, 0, 1524111668013);
INSERT INTO `t_file` VALUES (125, 9, 3, 5, '73506eb402d279524a5b9e96fb56433a', '1760a708-ff72-4654-b542-5f3256dda7c8', 'http://test-1255584620.file.myqcloud.com/1760a708-ff72-4654-b542-5f3256dda7c8.ppt', 'http://test-1255584620.cossh.myqcloud.com/1760a708-ff72-4654-b542-5f3256dda7c8.ppt', '第10章 AD-DA转换.ppt', '1760a708-ff72-4654-b542-5f3256dda7c8.ppt', 375296, 0, 1524112330076);
INSERT INTO `t_file` VALUES (128, 9, 90, 2, '8d1449ce38bd28e66560b563f715b981', '0face87d-5dc8-4a1b-98c7-83ebdbe7fd63', 'http://test-1255584620.file.myqcloud.com/0face87d-5dc8-4a1b-98c7-83ebdbe7fd63.jpg', 'http://test-1255584620.cossh.myqcloud.com/0face87d-5dc8-4a1b-98c7-83ebdbe7fd63.jpg', 'IMG_20170429_1.jpg', '0face87d-5dc8-4a1b-98c7-83ebdbe7fd63.jpg', 6385451, 0, 1524116579937);
INSERT INTO `t_file` VALUES (129, 9, 90, 2, '6eac206aab6e7a691a307115d301f886', 'b3cf43c1-c61a-4507-b338-615e77a9e562', 'http://test-1255584620.file.myqcloud.com/b3cf43c1-c61a-4507-b338-615e77a9e562.jpg', 'http://test-1255584620.cossh.myqcloud.com/b3cf43c1-c61a-4507-b338-615e77a9e562.jpg', 'IMG_20170519_2.jpg', 'b3cf43c1-c61a-4507-b338-615e77a9e562.jpg', 3869164, 0, 1524116593226);
INSERT INTO `t_file` VALUES (130, 9, 3, 1, NULL, '99ca02f8-c959-4ace-827b-b961b52257b1', NULL, NULL, 'ppt', NULL, NULL, 1, 1524116604178);
INSERT INTO `t_file` VALUES (131, 9, 130, 5, '8b422f3992360878ace9d298cca2f730', 'df0636a1-dd4e-4631-86bd-6a3f021bbbd2', 'http://test-1255584620.file.myqcloud.com/df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', 'http://test-1255584620.cossh.myqcloud.com/df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', '第8章 串行通信及接口电路.ppt', 'df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', 1539584, 0, 1524116629475);
INSERT INTO `t_file` VALUES (132, 9, 3, 7, '0089e4631c71b8f7b167b0df82cb5219', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96', 'http://test-1255584620.file.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 'http://test-1255584620.cossh.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', '微机答案.zip', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 26839651, 0, 1524116657030);
INSERT INTO `t_file` VALUES (133, 9, 3, 5, '30bf58d359a273dea51317ddce82d893', '5e97cfac-66ba-4235-89ee-fe76fdb798b7', 'http://test-1255584620.file.myqcloud.com/5e97cfac-66ba-4235-89ee-fe76fdb798b7.pdf', 'http://test-1255584620.cossh.myqcloud.com/5e97cfac-66ba-4235-89ee-fe76fdb798b7.pdf', '固态硬盘混合存储数据库的数据分布优化算法.pdf', '5e97cfac-66ba-4235-89ee-fe76fdb798b7.pdf', 948315, 0, 1524116814558);
INSERT INTO `t_file` VALUES (134, 9, 3, 5, '8d8ce8853c6277729cda288b294105ad', '1e385b97-9fcf-4185-9ece-e6d88e185ef5', 'http://test-1255584620.file.myqcloud.com/1e385b97-9fcf-4185-9ece-e6d88e185ef5.pdf', 'http://test-1255584620.cossh.myqcloud.com/1e385b97-9fcf-4185-9ece-e6d88e185ef5.pdf', '基于ElasticSearch的数字图书馆检索系统_张建中.pdf', '1e385b97-9fcf-4185-9ece-e6d88e185ef5.pdf', 247990, 0, 1524116826214);
INSERT INTO `t_file` VALUES (135, 9, 3, 2, '6eac206aab6e7a691a307115d301f886', 'b3cf43c1-c61a-4507-b338-615e77a9e562', 'http://test-1255584620.file.myqcloud.com/b3cf43c1-c61a-4507-b338-615e77a9e562.jpg', 'http://test-1255584620.cossh.myqcloud.com/b3cf43c1-c61a-4507-b338-615e77a9e562.jpg', 'IMG_20170519_2.jpg', 'b3cf43c1-c61a-4507-b338-615e77a9e562.jpg', 3869164, 0, 1524116878927);
INSERT INTO `t_file` VALUES (136, 9, 130, 1, NULL, 'bfba7b04-5651-47da-aae3-cad128985b42', NULL, NULL, '通信原理', NULL, NULL, 1, 1524453016478);
INSERT INTO `t_file` VALUES (137, 9, 130, 7, 'a38102d5350242a04f546dbeeb09a853', '99895299-21af-42a7-93f2-3b6049a95dec', 'http://test-1255584620.file.myqcloud.com/99895299-21af-42a7-93f2-3b6049a95dec.js', 'http://test-1255584620.cossh.myqcloud.com/99895299-21af-42a7-93f2-3b6049a95dec.js', 'scratchpad.js', '99895299-21af-42a7-93f2-3b6049a95dec.js', 689, 0, 1524453025266);
INSERT INTO `t_file` VALUES (138, 9, 130, 5, '4b6c0af9169370a423bcbfe922844147', '25597855-9cb7-45cb-86a6-1d72789b2347', 'http://test-1255584620.file.myqcloud.com/25597855-9cb7-45cb-86a6-1d72789b2347.doc', 'http://test-1255584620.cossh.myqcloud.com/25597855-9cb7-45cb-86a6-1d72789b2347.doc', '阶段练习1打印.doc', '25597855-9cb7-45cb-86a6-1d72789b2347.doc', 65536, 0, 1524453163796);
INSERT INTO `t_file` VALUES (139, 9, 130, 7, '0089e4631c71b8f7b167b0df82cb5219', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96', 'http://test-1255584620.file.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 'http://test-1255584620.cossh.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', '微机答案.zip', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 26839651, 0, 1524453174096);
INSERT INTO `t_file` VALUES (140, 9, 130, 5, '8b422f3992360878ace9d298cca2f730', 'df0636a1-dd4e-4631-86bd-6a3f021bbbd2', 'http://test-1255584620.file.myqcloud.com/df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', 'http://test-1255584620.cossh.myqcloud.com/df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', '第8章 串行通信及接口电路(2).ppt', 'df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', 1539584, 0, 1524453188821);
INSERT INTO `t_file` VALUES (141, 9, 130, 7, '0089e4631c71b8f7b167b0df82cb5219', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96', 'http://test-1255584620.file.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 'http://test-1255584620.cossh.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', '微机答案(2).zip', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 26839651, 0, 1524453210471);
INSERT INTO `t_file` VALUES (142, 9, 136, 7, '0089e4631c71b8f7b167b0df82cb5219', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96', 'http://test-1255584620.file.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 'http://test-1255584620.cossh.myqcloud.com/7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', '微机答案.zip', '7e116f5c-c2bc-491f-84ea-ee9b679cfe96.zip', 26839651, 0, 1524453402457);
INSERT INTO `t_file` VALUES (143, 9, 136, 5, '8b422f3992360878ace9d298cca2f730', 'df0636a1-dd4e-4631-86bd-6a3f021bbbd2', 'http://test-1255584620.file.myqcloud.com/df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', 'http://test-1255584620.cossh.myqcloud.com/df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', '第8章 串行通信及接口电路.ppt', 'df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', 1539584, 0, 1524453407704);
INSERT INTO `t_file` VALUES (144, 9, 136, 5, '8b422f3992360878ace9d298cca2f730', 'df0636a1-dd4e-4631-86bd-6a3f021bbbd2', 'http://test-1255584620.file.myqcloud.com/df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', 'http://test-1255584620.cossh.myqcloud.com/df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', '第8章 串行通信及接口电路(2).ppt', 'df0636a1-dd4e-4631-86bd-6a3f021bbbd2.ppt', 1539584, 0, 1524453425640);
INSERT INTO `t_file` VALUES (145, 9, 136, 7, '8e2ffe059eea4196ab463dc124b4f043', '7fc6a4db-ec60-4ca9-8797-20c0db381d1e', 'http://test-1255584620.file.myqcloud.com/7fc6a4db-ec60-4ca9-8797-20c0db381d1e.md', 'http://test-1255584620.cossh.myqcloud.com/7fc6a4db-ec60-4ca9-8797-20c0db381d1e.md', 'README.md', '7fc6a4db-ec60-4ca9-8797-20c0db381d1e.md', 21, 0, 1524453446036);

-- ----------------------------
-- Table structure for t_type
-- ----------------------------
DROP TABLE IF EXISTS `t_type`;
CREATE TABLE `t_type`  (
  `F_ID` int(11) NOT NULL AUTO_INCREMENT,
  `F_Caption` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`F_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_type
-- ----------------------------
INSERT INTO `t_type` VALUES (1, 'folder');
INSERT INTO `t_type` VALUES (2, 'img');
INSERT INTO `t_type` VALUES (3, 'video');
INSERT INTO `t_type` VALUES (4, 'music');
INSERT INTO `t_type` VALUES (5, 'doc');
INSERT INTO `t_type` VALUES (6, 'torrent');
INSERT INTO `t_type` VALUES (7, 'other');

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `F_ID` int(11) NOT NULL AUTO_INCREMENT,
  `F_RootID` int(11) NULL DEFAULT NULL,
  `F_Nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `F_Password` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `F_PhoneNum` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`F_ID`) USING BTREE,
  INDEX `F_RootID`(`F_RootID`) USING BTREE,
  CONSTRAINT `t_user_ibfk_1` FOREIGN KEY (`F_RootID`) REFERENCES `t_file` (`F_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES (9, 3, 'tommenx', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '15161171832');
INSERT INTO `t_user` VALUES (10, 4, 'tttzz', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '15057748814');

SET FOREIGN_KEY_CHECKS = 1;
