---
title: Docker metrics collector plugins
description: "Metrics plugins."
keywords:
  - "Examples
  - Usage
  - plugins
  - docker
  - documentation
  - user guide
  - metrics"
---

Docker exposes internal metrics based on the Prometheus format. Metrics plugins
enable accessing these metrics in a consistent way by providing a Unix
socket at a predefined path where the plugin can scrape the metrics.

> [!NOTE]
> While the plugin interface for metrics is non-experimental, the naming of the
> metrics and metric labels is still considered experimental and may change in a
> future version.

## Creating a metrics plugin

You must currently set `PropagatedMount` in the plugin `config.json` to
`/run/docker`. This allows the plugin to receive updated mounts
(the bind-mounted socket) from Docker after the plugin is already configured.

## MetricsCollector protocol

Metrics plugins must register as implementing the`MetricsCollector` interface
in `config.json`.

On Unix platforms, the socket is located at `/run/docker/metrics.sock` in the
plugin's rootfs.

`MetricsCollector` must implement two endpoints:

### `MetricsCollector.StartMetrics`

Signals to the plugin that the metrics socket is now available for scraping

Request:

```json
{}
```

The request has no payload.

Response:

```json
{
  "Err": ""
}
```

If an error occurred during this request, add an error message to the `Err` field
in the response. If no error then you can either send an empty response (`{}`)
or an empty value for the `Err` field. Errors will only be logged.

### `MetricsCollector.StopMetrics`

Signals to the plugin that the metrics socket is no longer available.
This may happen when the daemon is shutting down.

Request:

```json
{}
```

The request has no payload.

Response:

```json
{
  "Err": ""
}
```

If an error occurred during this request, add an error message to the `Err` field
in the response. If no error then you can either send an empty response (`{}`)
or an empty value for the `Err` field. Errors will only be logged.
