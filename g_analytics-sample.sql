/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 80027 (8.0.27)
 Source Host           : localhost:3306
 Source Schema         : g_analytics

 Target Server Type    : MySQL
 Target Server Version : 80027 (8.0.27)
 File Encoding         : 65001

 Date: 25/07/2022 17:51:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dimensions
-- ----------------------------
DROP TABLE IF EXISTS `dimensions`;
CREATE TABLE `dimensions`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `campaign` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `medium` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dimensions
-- ----------------------------
INSERT INTO `dimensions` VALUES (1, '(not set)', '(direct)', '(none)');
INSERT INTO `dimensions` VALUES (2, '(not set)', 'baidu.com', 'referral');
INSERT INTO `dimensions` VALUES (3, '(not set)', 'bing', 'organic');
INSERT INTO `dimensions` VALUES (4, '(not set)', 'facebook.com', 'referral');
INSERT INTO `dimensions` VALUES (5, '(not set)', 'google', 'organic');
INSERT INTO `dimensions` VALUES (6, '(not set)', 'l.instagram.com', 'referral');
INSERT INTO `dimensions` VALUES (7, '(not set)', 'm.facebook.com', 'referral');
INSERT INTO `dimensions` VALUES (8, '(not set)', 'm.youtube.com', 'referral');
INSERT INTO `dimensions` VALUES (9, '(not set)', 't.co', 'referral');
INSERT INTO `dimensions` VALUES (10, '(not set)', 'yahoo', 'organic');
INSERT INTO `dimensions` VALUES (11, '(not set)', 'youtube.com', 'referral');
INSERT INTO `dimensions` VALUES (12, '(not set)', '(direct)', '(none)');
INSERT INTO `dimensions` VALUES (13, '(not set)', 'baidu.com', 'referral');
INSERT INTO `dimensions` VALUES (14, '(not set)', 'bing', 'organic');
INSERT INTO `dimensions` VALUES (15, '(not set)', 'facebook.com', 'referral');
INSERT INTO `dimensions` VALUES (16, '(not set)', 'google', 'organic');
INSERT INTO `dimensions` VALUES (17, '(not set)', 'l.instagram.com', 'referral');
INSERT INTO `dimensions` VALUES (18, '(not set)', 'm.facebook.com', 'referral');
INSERT INTO `dimensions` VALUES (19, '(not set)', 'm.youtube.com', 'referral');
INSERT INTO `dimensions` VALUES (20, '(not set)', 't.co', 'referral');
INSERT INTO `dimensions` VALUES (21, '(not set)', 'yahoo', 'organic');
INSERT INTO `dimensions` VALUES (22, '(not set)', 'youtube.com', 'referral');

-- ----------------------------
-- Table structure for metrics
-- ----------------------------
DROP TABLE IF EXISTS `metrics`;
CREATE TABLE `metrics`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `sessions` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hits` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `newusers` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `users` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of metrics
-- ----------------------------
INSERT INTO `metrics` VALUES (1, '20', '28', '18', '19');
INSERT INTO `metrics` VALUES (2, '2', '2', '2', '2');
INSERT INTO `metrics` VALUES (3, '11', '20', '11', '11');
INSERT INTO `metrics` VALUES (4, '2', '2', '2', '2');
INSERT INTO `metrics` VALUES (5, '73', '101', '67', '68');
INSERT INTO `metrics` VALUES (6, '4', '4', '4', '4');
INSERT INTO `metrics` VALUES (7, '1', '1', '1', '1');
INSERT INTO `metrics` VALUES (8, '1', '2', '1', '1');
INSERT INTO `metrics` VALUES (9, '1', '1', '1', '1');
INSERT INTO `metrics` VALUES (10, '5', '11', '5', '5');
INSERT INTO `metrics` VALUES (11, '1', '1', '1', '1');
INSERT INTO `metrics` VALUES (12, '20', '28', '18', '19');
INSERT INTO `metrics` VALUES (13, '2', '2', '2', '2');
INSERT INTO `metrics` VALUES (14, '11', '20', '11', '11');
INSERT INTO `metrics` VALUES (15, '2', '2', '2', '2');
INSERT INTO `metrics` VALUES (16, '73', '101', '67', '68');
INSERT INTO `metrics` VALUES (17, '4', '4', '4', '4');
INSERT INTO `metrics` VALUES (18, '1', '1', '1', '1');
INSERT INTO `metrics` VALUES (19, '1', '2', '1', '1');
INSERT INTO `metrics` VALUES (20, '1', '1', '1', '1');
INSERT INTO `metrics` VALUES (21, '5', '11', '5', '5');
INSERT INTO `metrics` VALUES (22, '1', '1', '1', '1');

SET FOREIGN_KEY_CHECKS = 1;
