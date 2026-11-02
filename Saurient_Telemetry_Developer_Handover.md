# Saurient Carbon Passport Telemetry Developer Handover

For Dilli | Proposed implementation specification | 2 November 2026

## Purpose and collection architecture

Build a telemetry pipeline for Saurient Carbon Passport that collects factory measurements, preserves evidence, identifies data gaps and links validated consumption to product batches and versioned emissions calculations. This is a proposed developer handover for Dilli, not confirmation that these capabilities already exist.

### End to end flow

Meter or sensor → SaurEdge or compatible gateway → authenticated HTTPS or MQTT ingestion → validation and raw archive → time-series storage → consumption calculation → batch allocation → emissions calculation → verifier review → passport issuance.

The React frontend reads backend APIs and receives live updates through SSE or WebSocket. It does not connect directly to factory meters. A reading is an input, not an independently verified emissions result.

| Source situation | Collection method | Configuration needed |
| --- | --- | --- |
| RS485 meter | Gateway polls supported protocol, commonly Modbus RTU | Serial settings, unit address, manufacturer register map |
| Ethernet meter | Modbus TCP connector on factory network | IP, port, unit identifier, register map |
| PLC or SCADA | Approved OPC UA tags or supported interface | Tags, credentials, units, quality codes |
| Connected IoT device | MQTT publish or HTTPS push | Device identity, topic or endpoint, payload mapping |
| Vendor cloud | Supported vendor API connector | Permissions, API limits, polling and history access |
| Unconnected source | Manual entry or CSV upload | Evidence, units, period and Manual source label |

RS485 is an electrical interface; Modbus RTU is one protocol that can use it. Confirm model-specific support. SaurEdge is the preferred collector, while compatible third-party gateways should remain supported.

## Device onboarding and message contract

Organisation → Facility → Process or production line → Device → Metric mapping → Test connection → Activate collection. Registration must establish who owns the measurement and what equipment it covers.

| Field group | Required information |
| --- | --- |
| Identity | Device ID, gateway ID, manufacturer, model, serial number, owner |
| Location and boundary | Organisation, facility, line/process, equipment covered and parent/submeter relationship |
| Connection | Protocol, address, serial/network settings and credential reference |
| Interpretation | Register/tag, data type, byte order, scale, unit and mapping version |
| Timing | Polling interval, expected reporting frequency, timezone handling and stale threshold |
| Assurance | Calibration reference, applicable validity dates, evidence and alert recipient |

Test Connection must show the decoded value, unit, observed timestamp, quality and an actionable error before activation. Never assume that different meter models use identical registers.

### Example normalised reading

```json
{
  "schema_version": "1.0",
  "event_id": "gw01-session08-000184",
  "device_id": "meter-001",
  "gateway_id": "gateway-01",
  "metric": "electricity_import_total",
  "value": 125480.5,
  "unit": "kWh",
  "measurement_type": "cumulative_counter",
  "observed_at": "2026-11-02T08:30:00Z",
  "sequence": 184,
  "quality": "good",
  "source_mode": "live",
  "mapping_version": "meter-profile-v1"
}
```

Resolve tenant and facility from the authenticated device registry. Add received_at on the server. Preserve raw payloads and reject or quarantine invalid messages. Deduplicate using a stable event ID whose uniqueness survives gateway restarts.

## Consumption and carbon calculation

Preserve separate stages for raw readings, validated readings, consumption intervals, batch allocations and emissions results. Every derived record should reference its source records and transformation version.

| Measurement | Calculation treatment |
| --- | --- |
| Cumulative energy in kWh | Subtract valid boundary readings; account for resets and rollover |
| Instantaneous power in kW | Integrate over time; document sampling method and missing intervals |
| Fuel volume or mass | Apply unit conversion and relevant fuel calculation methodology |
| Production output | Use as denominator and allocation evidence within a defined period |
| Temperature or pressure | Operational context unless a documented method uses it |

### Illustrative example

Start reading 125,000 kWh; end reading 125,800 kWh. Consumption = 800 kWh. Using an illustrative factor of 0.60 kg CO2e/kWh gives 480 kg CO2e. If all this electricity is attributable to 1,000 units, the electricity contribution is 0.48 kg CO2e per unit. The factor is synthetic and this is not a complete product footprint.

### Allocation and accounting controls

- Define the assessment period, measurement boundary, units and production quantity before calculating intensity.

- For shared meters, document allocation by an approved driver such as submetered energy, production mass or machine hours. Store the rationale and version.

- Prevent counting a main meter and its included submeters twice. Reconcile meter totals against invoices and record investigation outcomes.

- Assign Scope 1, 2 or 3 using the accounting boundary and activity context. A device protocol cannot determine the scope.

- Version emission factors, geography, validity period, formulas, mappings and calculation inputs. Record exclusions, estimates and uncertainty.

- Telemetry alone does not establish all Scope 1, 2 and 3 inputs, full PCF coverage, regulatory acceptance or eligibility for carbon credits.

## Failure scenarios and evidence integrity

| Scenario | Expected behaviour |
| --- | --- |
| Internet outage | Buffer locally; retry with original event IDs and observation times |
| Buffer capacity exceeded | Alert and explicitly record lost coverage; do not promise zero data loss |
| Replay after reconnection | Accept delayed readings, deduplicate and recompute affected draft aggregates |
| Device silent | Mark Stale or Offline after threshold; never replace missing usage with zero |
| Invalid unit or spike | Retain raw input; quarantine or flag with a reason and assigned owner |
| Counter drops | Investigate reset, rollover or replacement before deriving consumption |
| Wrong device clock | Flag time quality; retain observed_at and received_at separately |
| Out of order data | Use measurement time; update affected draft intervals deterministically |
| Expired calibration evidence | Flag according to configured policy and review the affected period |
| Late data after verification | Open impact review and create a revision; preserve frozen records |
| Simulation | Label Simulated in views, calculations, evidence exports and passports |

### Security and operations

Use TLS for external transport, per-gateway or per-device credentials, tenant isolation, least-privilege access and credential rotation/revocation. Keep secrets outside the frontend and logs. Default industrial connectors to read-only operation and outbound gateway connectivity; do not expose meter ports to the public internet.

Set retention, archive, backup and recovery policies. Track gateway heartbeat separately from measurement freshness. Monitor ingest failures, queue depth, buffer capacity, missing intervals and delivery delay. Retain corrections as new records linked to originals rather than silently overwriting evidence.

## Platform screens and storage design

| Screen | Required content |
| --- | --- |
| Device Registry | Identity, facility, boundary, gateway, calibration and connection status |
| Connection Setup | Protocol profile, register/tag mapping, test connection and activation |
| Live Telemetry | Current values, units, charts, observed time, freshness and source mode |
| Quality and Exceptions | Missing intervals, spikes, resets, owner, resolution and audit history |
| Consumption and Batch Mapping | Period totals, production output, batch links and allocation method |
| Calculation Trace | Source references, transformations, factor version, formulas and results |
| Verifier Evidence | Coverage, calibration, exceptions, resolutions and frozen assessment snapshot |

Keep connection status, measurement quality and verification status separate. An online device can send invalid data. Valid measurements can still be unreviewed. Public viewers receive approved summaries; detailed factory telemetry stays permission controlled.

| Storage responsibility | Recommended contents |
| --- | --- |
| Nexus graph and configuration | Device ownership, facility/process links, profiles and configuration versions |
| Time-series database | Timestamped readings, consumption intervals and aggregates |
| Evidence and object storage | Raw payload archives, calibration records and supporting documents |
| Calculation and audit records | Source references, versions, allocations, findings, approvals and passport snapshots |

Keep high-volume telemetry outside etcd and CRDs. The graph should reference measurements and time windows rather than represent every reading as a resource. Database choice and retention depend on expected devices, reporting frequency and query volume.

### Proposed backend capabilities

Device registration and credential provisioning; mapping profiles; idempotent batch ingestion; historical queries and live subscriptions; consumption derivation; exception resolution; batch allocation; evidence snapshots. These are capability requirements, not claims about existing endpoints.

## Delivery plan and acceptance criteria

### First PoC

- Register one organisation, facility and real electricity meter through one gateway.

- Decode cumulative kWh using the exact manufacturer register map and display readings with source times.

- Demonstrate internet outage, buffered replay, deduplication and a visible missing interval.

- Link period consumption to one product batch using a stated allocation method.

- Calculate electricity emissions using a versioned factor and preserve the calculation trace.

- Let a verifier review evidence and findings, freeze the approved assessment and issue a clearly labelled demo passport.

### Acceptance tests

| Test | Pass condition |
| --- | --- |
| Known reference reading | Decoded value, scaling and unit match the physical meter |
| Duplicate replay | Consumption and emissions remain unchanged |
| Offline and recovery | Original timestamps retained; device freshness and coverage are accurate |
| Counter reset | No negative consumption silently accepted |
| Tenant isolation | One organisation cannot read or ingest for another organisation |
| Batch allocation | Allocated totals reconcile to the selected measurement boundary |
| Verified revision | Changed input creates an impact review and new version |
| Traceability | Passport result links to calculation, allocation and source readings |

### Inputs needed before physical integration

Obtain the exact meter and gateway model, firmware, protocol manual, register map, sample readings, network constraints and calibration records. Confirm who supplies the gateway software, the payload contract, polling rate, local buffer duration and production-volume source. No device-specific register addresses are assumed in this document.

### Technical references

Modbus Organization — Serial Line Specification and Implementation Guide: https://www.modbus.org/file/secure/modbusoverserial.pdf

Modbus Organization — Introduction to Modbus: https://www.modbus.org/introduction-to-modbus

OPC Foundation — OPC UA overview and subscriptions: https://opcfoundation.org/about/opc-technologies/opc-ua/

Prepared 2 November 2026. Architecture and PoC recommendations require validation against actual hardware and project implementation.
