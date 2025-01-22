import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  getStarted: [
    {
      type: "doc",
      id: "get-started/get-docker",
      label: "Docker 설치하기",
    },
    {
      type: "doc",
      id: "get-started/docker-overview",
      label: "Docker 개요",
    },
    {
      type: "category",
      label: "시작하기",
      link: {
        type: "doc",
        id: "get-started/introduction/index",
      },
      items: [
        "get-started/introduction/get-docker-desktop",
        "get-started/introduction/develop-with-containers",
        "get-started/introduction/build-and-push-first-image",
        "get-started/introduction/whats-next",
      ],
    },
    {
      type: "category",
      label: "Docker 개념",
      items: [
        {
          type: "category",
          label: "기초 개념",
          items: [
            "get-started/docker-concepts/the-basics/what-is-a-container",
            "get-started/docker-concepts/the-basics/what-is-an-image",
            "get-started/docker-concepts/the-basics/what-is-a-registry",
            "get-started/docker-concepts/the-basics/what-is-docker-compose",
          ],
        },
        {
          type: "category",
          label: "이미지 빌드하기",
          items: [
            "get-started/docker-concepts/building-images/understanding-image-layers",
            "get-started/docker-concepts/building-images/writing-a-dockerfile",
            "get-started/docker-concepts/building-images/build-tag-and-publish-an-image",
            "get-started/docker-concepts/building-images/using-the-build-cache",
            "get-started/docker-concepts/building-images/multi-stage-builds",
          ],
        },
        {
          type: "category",
          label: "컨테이너 실행하기",
          items: [
            "get-started/docker-concepts/running-containers/publishing-ports",
            "get-started/docker-concepts/running-containers/overriding-container-defaults",
            "get-started/docker-concepts/running-containers/persisting-container-data",
            "get-started/docker-concepts/running-containers/sharing-local-files",
            "get-started/docker-concepts/running-containers/multi-container-applications",
          ],
        },
      ],
    },
    {
      type: "doc",
      id: "get-started/resources",
      label: "리소스",
    },
    {
      type: "category",
      label: "실습",
      items: [
        {
          type: "doc",
          id: "get-started/workshop/our_app",
          label: "파트 1. 우리의 첫 번째 앱",
        },
        {
          type: "doc",
          id: "get-started/workshop/updating_app",
          label: "파트 2. 앱 업데이트",
        },
        {
          type: "doc",
          id: "get-started/workshop/sharing_app",
          label: "파트 3. 앱 공유하기",
        },
        {
          type: "doc",
          id: "get-started/workshop/persisting_data",
          label: "파트 4. 데이터 유지하기",
        },
        {
          type: "doc",
          id: "get-started/workshop/bind_mounts",
          label: "파트 5. 바인드 마운트",
        },
        {
          type: "doc",
          id: "get-started/workshop/multi_container",
          label: "파트 6. 멀티 컨테이너 앱",
        },
        {
          type: "doc",
          id: "get-started/workshop/using_compose",
          label: "파트 7. Docker Compose 사용하기",
        },
        {
          type: "doc",
          id: "get-started/workshop/image_best",
          label: "파트 8. 이미지 최적화 베스트 프랙티스",
        },
        {
          type: "doc",
          id: "get-started/workshop/what_next",
          label: "파트 9. 다음 단계는?",
        },
      ],
    },
  ],
  manual: [
    {
      type: "category",
      label: "Docker Engine",
      items: [
        {
          type: "category",
          label: "설치",
          items: [
            "manuals/engine/install/ubuntu",
            "manuals/engine/install/debian",
            "manuals/engine/install/rhel",
            "manuals/engine/install/fedora",
            "manuals/engine/install/raspberry-pi-os",
            "manuals/engine/install/centos",
            "manuals/engine/install/sles",
            "manuals/engine/install/binaries",
            "manuals/engine/install/linux-postinstall",
          ],
        },
        {
          type: "category",
          label: "스토리지",
          items: [
            "manuals/engine/storage/volumes",
            "manuals/engine/storage/bind-mounts",
            "manuals/engine/storage/tmpfs",
            {
              type: "category",
              label: "스토리지 드라이버",
              items: [
                "manuals/engine/storage/drivers/select-storage-driver",
                "manuals/engine/storage/drivers/btrfs-driver",
                "manuals/engine/storage/drivers/device-mapper-driver",
                "manuals/engine/storage/drivers/overlayfs-driver",
                "manuals/engine/storage/drivers/vfs-driver",
                "manuals/engine/storage/drivers/windowsfilter-driver",
                "manuals/engine/storage/drivers/zfs-driver",
              ],
            },
            "manuals/engine/storage/containerd",
          ],
        },
        {
          type: "category",
          label: "네트워크",
          items: [
            "manuals/engine/network/packet-filtering-firewalls",
            {
              type: "category",
              label: "네트워크 드라이버",
              items: [
                "manuals/engine/network/drivers/bridge",
                "manuals/engine/network/drivers/host",
                "manuals/engine/network/drivers/ipvlan",
                "manuals/engine/network/drivers/macvlan",
                "manuals/engine/network/drivers/none",
                "manuals/engine/network/drivers/overlay",
              ],
            },
            {
              type: "category",
              label: "튜토리얼",
              items: [
                "manuals/engine/network/tutorials/macvlan",
                "manuals/engine/network/tutorials/host",
                "manuals/engine/network/tutorials/overlay",
                "manuals/engine/network/tutorials/standalone",
              ],
            },
            "manuals/engine/network/ca-certs",
            "manuals/engine/network/links",
          ],
        },
        {
          type: "category",
          label: "컨테이너",
          items: [
            "manuals/engine/containers/start-containers-automatically",
            "manuals/engine/containers/multi-service_container",
            "manuals/engine/containers/resource_constraints",
            "manuals/engine/containers/runmetrics",
            "manuals/engine/containers/run",
          ],
        },
        {
          type: "category",
          label: "CLI",
          items: [
            "manuals/engine/cli/completion",
            "manuals/engine/cli/proxy",
            "manuals/engine/cli/filter",
            "manuals/engine/cli/formatting",
            "manuals/engine/cli/otel",
          ],
        },
        {
          type: "category",
          label: "데몬",
          items: [
            "manuals/engine/daemon/start",
            "manuals/engine/daemon/ipv6",
            "manuals/engine/daemon/proxy",
            "manuals/engine/daemon/live-restore",
            "manuals/engine/daemon/alternative-runtimes",
            "manuals/engine/daemon/prometheus",
            "manuals/engine/daemon/remote-access",
            "manuals/engine/daemon/logs",
            "manuals/engine/daemon/troubleshoot",
          ],
        },
        {
          type: "category",
          label: "리소스 관리",
          items: [
            "manuals/engine/manage-resources/contexts",
            "manuals/engine/manage-resources/labels",
            "manuals/engine/manage-resources/pruning",
          ],
        },
        {
          type: "category",
          label: "로그 및 메트릭",
          items: [
            "manuals/engine/logging/configure",
            "manuals/engine/logging/log_tags",
            {
              type: "category",
              label: "로깅 드라이버",
              items: [
                "manuals/engine/logging/drivers/awslogs",
                "manuals/engine/logging/drivers/etwlogs",
                "manuals/engine/logging/drivers/fluentd",
                "manuals/engine/logging/drivers/gcplogs",
                "manuals/engine/logging/drivers/gelf",
                "manuals/engine/logging/drivers/journald",
                "manuals/engine/logging/drivers/json-file",
                "manuals/engine/logging/drivers/local",
                "manuals/engine/logging/drivers/splunk",
                "manuals/engine/logging/drivers/syslog",
              ],
            },
            "manuals/engine/logging/plugins",
            "manuals/engine/logging/dual-logging",
          ],
        },
        {
          type: "category",
          label: "보안",
          items: [
            "manuals/engine/security/rootless",
            "manuals/engine/security/antivirus",
            "manuals/engine/security/apparmor",

            {
              type: "category",
              label: "Docker 컨텐츠 신뢰",
              items: [
                "manuals/engine/security/trust/trust_automation",
                "manuals/engine/security/trust/trust_delegation",
                "manuals/engine/security/trust/deploying_notary",
                "manuals/engine/security/trust/trust_key_mng",
                "manuals/engine/security/trust/trust_sandbox",
              ],
            },
            "manuals/engine/security/non-events",
            "manuals/engine/security/userns-remap",
            "manuals/engine/security/protect-access",
            "manuals/engine/security/seccomp",
            "manuals/engine/security/certificates",
          ],
        },
        {
          type: "category",
          label: "스웜 모드",
          items: [
            "manuals/engine/swarm/admin_guide",
            "manuals/engine/swarm/stack-deploy",
            "manuals/engine/swarm/services",
            {
              type: "category",
              label: "스웜 모드 시작하기",
              items: [
                "manuals/engine/swarm/swarm-tutorial/create-swarm",
                "manuals/engine/swarm/swarm-tutorial/add-nodes",
                "manuals/engine/swarm/swarm-tutorial/deploy-service",
                "manuals/engine/swarm/swarm-tutorial/inspect-service",
                "manuals/engine/swarm/swarm-tutorial/scale-service",
                "manuals/engine/swarm/swarm-tutorial/delete-service",
                "manuals/engine/swarm/swarm-tutorial/rolling-update",
                "manuals/engine/swarm/swarm-tutorial/drain-node",
              ],
            },
            {
              type: "category",
              label: "스웜 작동 방식",
              items: [
                "manuals/engine/swarm/how-swarm-mode-works/nodes",
                "manuals/engine/swarm/how-swarm-mode-works/services",
                "manuals/engine/swarm/how-swarm-mode-works/pki",
                "manuals/engine/swarm/how-swarm-mode-works/swarm-task-states",
              ],
            },
            "manuals/engine/swarm/join-nodes",
            "manuals/engine/swarm/swarm_manager_locking",
            "manuals/engine/swarm/manage-nodes",
            "manuals/engine/swarm/secrets",
            "manuals/engine/swarm/networking",
            "manuals/engine/swarm/raft",
            "manuals/engine/swarm/swarm-mode",
            "manuals/engine/swarm/configs",
            "manuals/engine/swarm/key-concepts",
            "manuals/engine/swarm/ingress",
          ],
        },
        {
          type: "doc",
          id: "manuals/engine/swarm/deprecated",
          label: "지원 중단된 기능",
        },
        {
          type: "category",
          label: "Docker Engine 플러그인",
          items: [
            "manuals/engine/extend/plugins_authorization",
            "manuals/engine/extend/plugins_logging",
            "manuals/engine/extend/plugins_network",
            "manuals/engine/extend/plugin_api",
            "manuals/engine/extend/plugins_volume",
            "manuals/engine/extend/config",
            "manuals/engine/extend/legacy_plugins",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Docker Build",
      items: [
        {
          type: "category",
          label: "핵심 개념",
          items: [
            "manuals/build/concepts/overview",
            "manuals/build/concepts/dockerfile",
            "manuals/build/concepts/context",
          ],
        },
        {
          type: "category",
          label: "빌드",
          items: [
            "manuals/build/building/multi-stage",
            "manuals/build/building/variables",
            "manuals/build/building/secrets",
            "manuals/build/building/multi-platform",
            "manuals/build/building/export",
            "manuals/build/building/best-practices",
            "manuals/build/building/base-images",
          ],
        },
        {
          type: "doc",
          id: "manuals/build/checks",
          label: "빌드 검사",
        },
        {
          type: "category",
          label: "Builders",
          items: [
            {
              type: "category",
              label: "빌드 드라이버",
              items: [
                "manuals/build/builders/drivers/docker-container",
                "manuals/build/builders/drivers/docker",
                "manuals/build/builders/drivers/kubernetes",
                "manuals/build/builders/drivers/remote",
              ],
            },
            "manuals/build/builders/manage",
          ],
        },
        {
          type: "category",
          label: "베이크",
          items: [
            "manuals/build/bake/introduction",
            "manuals/build/bake/targets",
            "manuals/build/bake/inheritance",
            "manuals/build/bake/variables",
            "manuals/build/bake/expressions",
            "manuals/build/bake/funcs",
            "manuals/build/bake/matrices",
            "manuals/build/bake/contexts",
            "manuals/build/bake/bake-reference",
            "manuals/build/bake/compose-file",
            "manuals/build/bake/overrides",
            "manuals/build/bake/remote-definition",
          ],
        },
        {
          type: "category",
          label: "캐시",
          items: [
            "manuals/build/cache/invalidation",
            "manuals/build/cache/garbage-collection",
            {
              type: "category",
              label: "벡엔드",
              items: [
                "manuals/build/cache/backends/s3",
                "manuals/build/cache/backends/azblob",
                "manuals/build/cache/backends/gha",
                "manuals/build/cache/backends/inline",
                "manuals/build/cache/backends/local",
                "manuals/build/cache/backends/registry",
              ],
            },
            "manuals/build/cache/optimize",
          ],
        },
        {
          type: "category",
          label: "CI",
          items: [
            {
              type: "category",
              label: "GitHub Actions",
              items: [
                "manuals/build/ci/github-actions/annotations",
                "manuals/build/ci/github-actions/attestations",
                "manuals/build/ci/github-actions/checks",
                "manuals/build/ci/github-actions/secrets",
                "manuals/build/ci/github-actions/build-summary",
                "manuals/build/ci/github-actions/configure-builder",
                "manuals/build/ci/github-actions/cache",
                "manuals/build/ci/github-actions/copy-image-registries",
                "manuals/build/ci/github-actions/export-docker",
                "manuals/build/ci/github-actions/local-registry",
                "manuals/build/ci/github-actions/multi-platform",
                "manuals/build/ci/github-actions/named-contexts",
                "manuals/build/ci/github-actions/push-multi-registries",
                "manuals/build/ci/github-actions/reproducible-builds",
                "manuals/build/ci/github-actions/share-image-jobs",
                "manuals/build/ci/github-actions/manage-tags-labels",
                "manuals/build/ci/github-actions/test-before-push",
                "manuals/build/ci/github-actions/update-dockerhub-desc",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "메타데이터",
          items: [
            "manuals/build/metadata/annotations",
            {
              type: "category",
              label: "빌드 증명",
              items: [
                "manuals/build/metadata/attestations/attestation-storage",
                "manuals/build/metadata/attestations/slsa-provenance",
                "manuals/build/metadata/attestations/sbom",
                "manuals/build/metadata/attestations/slsa-definitions",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "내보내기 도구",
          items: [
            "manuals/build/exporters/image-registry",
            "manuals/build/exporters/local-tar",
            "manuals/build/exporters/oci-docker",
          ],
        },
        {
          type: "category",
          label: "BuildKit",
          items: [
            "manuals/build/buildkit/buildkitd-toml",
            "manuals/build/buildkit/configure",
            "manuals/build/buildkit/frontend",
          ],
        },
        {
          type: "category",
          label: "디버깅",
          items: ["manuals/build/debug/opentelemetry"],
        },
      ],
    },
    {
      type: "category",
      label: "Docker Compose",
      items: [
        {
          type: "category",
          label: "소개",
          items: [
            "manuals/compose/intro/compose-application-model",
            "manuals/compose/intro/features-uses",
            "manuals/compose/intro/history",
          ],
        },
        {
          type: "category",
          label: "설치",
          items: [
            "manuals/compose/install/linux",
            "manuals/compose/install/standalone",
            "manuals/compose/install/uninstall",
          ],
        },
        {
          type: "doc",
          id: "manuals/compose/gettingstarted",
          label: "빠른 시작",
        },
        {
          type: "category",
          label: "사용 방법",
          items: [
            "manuals/compose/how-tos/project-name",
            "manuals/compose/how-tos/lifecycle",
            "manuals/compose/how-tos/profiles",
            "manuals/compose/how-tos/startup-order",
            {
              type: "category",
              label: "환경 변수 사용",
              items: [
                "manuals/compose/how-tos/environment-variables/set-environment-variables",
                "manuals/compose/how-tos/environment-variables/envvars-precedence",
                "manuals/compose/how-tos/environment-variables/envvars",
                "manuals/compose/how-tos/environment-variables/variable-interpolation",
                "manuals/compose/how-tos/environment-variables/best-practices",
              ],
            },
            "manuals/compose/how-tos/file-watch",
            "manuals/compose/how-tos/use-secrets",
            "manuals/compose/how-tos/networking",
            {
              type: "category",
              label: "여러 Compose 파일 사용",
              items: [
                "manuals/compose/how-tos/multiple-compose-files/merge",
                "manuals/compose/how-tos/multiple-compose-files/extends",
                "manuals/compose/how-tos/multiple-compose-files/include",
              ],
            },
            "manuals/compose/how-tos/gpu-support",
            "manuals/compose/how-tos/production",
          ],
        },
        {
          type: "category",
          label: "브리지",
          items: [
            "manuals/compose/bridge/usage",
            "manuals/compose/bridge/customize",
            "manuals/compose/bridge/advanced-integration",
          ],
        },
        "manuals/compose/gettingstarted",
        {
          type: "category",
          label: "지원 및 피드백",
          items: [
            "manuals/compose/support-and-feedback/faq",
            "manuals/compose/support-and-feedback/feedback",
            "manuals/compose/support-and-feedback/samples-for-compose",
          ],
        },
      ],
    },
    {
      type: "doc",
      id: "manuals/registry",
      label: "Registry",
    }
  ],
  reference: ["reference/intro"],
};

export default sidebars;
