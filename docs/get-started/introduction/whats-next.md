---
title: 다음 단계
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 핵심 Docker 개념, 이미지 빌드 및 컨테이너 실행을 이해하는 데 도움이 되는 단계별 가이드를 탐색합니다.
aliases:
  - /guides/getting-started/whats-next/
notoc: true
weight: 4
---

import { theBasics, buildingImages, runningContainers } from "@site/src/data/introduction-whatsnext";

다음 섹션에서는 핵심 Docker 개념, 이미지 빌드 및 컨테이너 실행을 이해하는 데 도움이 되는 단계별 가이드를 제공합니다.

## 기본 사항 {#the-basics}

컨테이너, 이미지, 레지스트리 및 Docker Compose의 핵심 개념을 배우기 시작합니다.

<Grid items={theBasics} />

## 이미지 빌드 {#building-images}

Dockerfile, 빌드 캐시 및 멀티 스테이지 빌드를 사용하여 최적화된 컨테이너 이미지를 만듭니다.

<Grid items={buildingImages} />

## 컨테이너 실행 {#running-containers}

포트 노출, 기본값 재정의, 데이터 지속성, 파일 공유 및 멀티 컨테이너 애플리케이션 관리에 대한 필수 기술을 마스터합니다.

<Grid items={runningContainers} />
