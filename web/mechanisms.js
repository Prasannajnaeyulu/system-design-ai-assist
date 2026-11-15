window.MECHANISMS = {
  "week-01-card-authorization": {
    title: "Load balancer, then a stateless service",
    paragraphs: [
      "Draw the path before you draw the database. The terminal calls a DNS name. A load balancer owns that name and sends the tap to one healthy instance of the auth service. The instance stores nothing about the payment on its own disk. The decision row lives in the database. When you deploy, the load balancer stops sending new taps to an instance and lets the in-flight one finish. That is connection draining.",
      "The load balancer does not know what an approval means. It spreads connections, checks health, and drops an instance that stopped answering. If it retries a timed-out charge on its own, it can create a second attempt. The idempotency key has to be on the request so any instance can recognize the retry.",
      "In a cloud account this service runs as several identical copies in more than one availability zone. An availability zone is one data center in the region. Losing one zone removes those copies. The load balancer sends the next tap to a copy that is still up. Autoscaling adds copies when the rush hits 2,000 taps a second. It does not make a slow bank answer faster. The 80 ms issuer call is still the hard part."
    ],
    terms: [
      ["Load balancer", "Sends each request to a healthy instance. It is not the source of truth."],
      ["Stateless service", "Any instance can handle the next tap, because the decision is in the database."],
      ["Availability zone", "One data center. Spread copies so one zone dying is a smaller outage."]
    ]
  },
  "week-01-banking-chatbot-critique": {
    title: "The model is another hop, with its own deadline",
    paragraphs: [
      "The chat service is also stateless and sits behind the same kind of load balancer. A balance read is a call to the ledger, not a memory inside the model container. The model call has a shorter budget than the whole screen. If you give the model the entire 800 ms, you have nothing left when the ledger is slow.",
      "Do not cache the model's last answer as the balance. A cloud GPU pool or a model API is just a dependency with a timeout, a cost, and a habit of sounding sure. Scale the chat instances on request rate. Scale the ledger on the correctness of the balance, not on the number of chat pods."
    ],
    terms: [
      ["Hop", "One network call on the path. Each hop adds a timeout you have to name."],
      ["Local disk", "A file on the chat instance disappears when that instance is replaced. It is not an audit log."]
    ]
  },
  "week-02-ledger-vs-feed": {
    title: "The index finds the row. It is not the balance.",
    paragraphs: [
      "An index is a sorted lookup the database maintains so a balance check does not scan every account. The useful one here is the primary key on account id. The feed wants a second index on account id plus time, so the home screen can read the latest page without sorting the whole history.",
      "A read replica is a follower the cloud database keeps in another zone. Point the feed at it if a few seconds of lag is acceptable. Point the card check at the primary. Adding replicas does not fix a missing index. A missing index makes the primary busy, and then every zone feels slow.",
      "Failover in a managed database promotes one replica to primary. For a short window, writes fail or land on the new primary. Your auth service must treat that as unknown and retry with the same key, not as a decline and not as a new charge."
    ],
    terms: [
      ["Primary key index", "Finds one account row. This is the lookup for a balance check."],
      ["Secondary index", "Finds rows by another column, such as recent activity for one account."],
      ["Read replica", "A follower. Safe for the home screen. Wrong for approving a card."]
    ]
  },
  "week-02-charge-idempotency": {
    title: "A unique index is what makes the retry safe across instances",
    paragraphs: [
      "Two instances behind the load balancer can both receive the retry. An if-statement in one process does not see the other process. A unique index on the idempotency key makes the database reject the second insert. The key and the debit have to commit in one transaction, or the unique index never gets the row and the retry charges again.",
      "Put the key in the request the load balancer forwards unchanged. Do not let the balancer, the gateway, or a mesh retry generate a new key."
    ],
    terms: [
      ["Unique index", "The database allows one row for that key. The second insert fails instead of posting twice."],
      ["Gateway retry", "A retry in front of your service is still a second request. It is safe only with the same key."]
    ]
  },
  "week-03-cache-boundaries": {
    title: "Caching is a copy you can throw away",
    paragraphs: [
      "Cache-aside is the pattern to defend. The service asks the cache. On a miss it reads the source, then fills the cache. Catalog metadata can live there with a time-to-live or an invalidation event when a title changes. A shared cloud cache, such as a managed Redis, is visible to every instance. That is why it works behind a load balancer. A cache inside one process is invisible to the other instances, so they keep missing and hammering the database.",
      "A miss storm is a stampede. Many instances miss at once and all read the database. Single-flight means one instance rebuilds the value and the others wait. Say that when you cache something popular.",
      "Do not cache an authorization balance. A 5 second copy can approve two cards against the same money. The home screen may show a cached balance if it is labeled and if pull-to-refresh reads the primary. Driver location for dispatch is the same kind of mistake if the copy is older than a couple of seconds. Eviction, TTL, and a flushed Redis are normal. If the system cannot rebuild from the source after that, the cache was secretly the database."
    ],
    terms: [
      ["Cache-aside", "Read the cache, and on a miss read the source and fill the cache."],
      ["TTL", "How long a copy may be served before it is fetched again."],
      ["Invalidation", "A delete or an update when the source changes, so you do not wait for the TTL."],
      ["Stampede", "Many misses at once. One rebuild should serve the rest."]
    ]
  },
  "week-03-partitioning": {
    title: "Partition key chooses the machine. The index chooses the row.",
    paragraphs: [
      "A partition key decides which shard holds the account. Payments partition by account id so the balance and the new posting land on one machine and can be locked together. An index on merchant id does not help that write. It helps a question like 'all of this merchant's payments,' and that question is allowed to fan out or to use a derived store.",
      "A hot key is one account, or one feature entity, that takes a huge share of the writes. More shards do not help if every write hashes to the same one. More load-balancer instances do not help either. They all still call that shard.",
      "In a cloud database, changing the partition key later is a migration, not a setting. Pick it from the access pattern you named: one account's balance, one entity's features. Say what query you are refusing to make fast."
    ],
    terms: [
      ["Partition key", "Which machine stores this account. Chosen for the write that must be correct."],
      ["Hot key", "One key so busy that extra machines stay idle."],
      ["Scatter", "A query that must visit every shard. Fine for a report. Wrong for the card tap."]
    ]
  },
  "week-04-settlement-outbox": {
    title: "A queue is how work leaves the request",
    paragraphs: [
      "The capture commits in the database with an outbox row. A worker publishes that row to a managed queue and only then marks it sent. The customer's request does not wait for settlement. The worker is stateless. You add more workers when the queue depth grows. That is the autoscaler for this path, not a bigger load balancer on the API.",
      "A cloud queue delivers at least once. A visibility timeout hides a message while a worker handles it. If the worker crashes, the message returns. The consumer needs its own idempotency key so a second delivery does not settle twice. A poison message, one that fails every time, has to go to a dead-letter queue after a bounded number of tries. Leaving it in the main queue blocks the workers behind it."
    ],
    terms: [
      ["Visibility timeout", "How long a queue hides a message while a worker owns it."],
      ["Dead-letter queue", "Where a message goes after it has failed enough times that retrying is the bug."],
      ["Competing consumers", "Several workers share one queue. Each message should be handled by one of them."]
    ]
  },
  "week-04-retries-and-poison": {
    title: "Timeouts at three different layers",
    paragraphs: [
      "The load balancer, the service, and the database each have a timeout. They must agree. If the balancer gives up at 100 ms and the service is still waiting on the bank at 80 ms plus the write, the client retries while the first request is still running. That is how a cloud mesh or an API gateway creates a duplicate charge.",
      "Retry with the same key, with jitter, and with a limit. A poison message is one that will fail the same way every time, such as a payload you cannot parse. Retrying it forever burns the workers. Stop, park it, and alert. A timeout from the bank is not poison. It is unknown, and the same key is the right retry."
    ],
    terms: [
      ["Jitter", "A random pause before the retry so every client does not hit you in the same millisecond."],
      ["Deadline", "The time left for the whole call. Inner timeouts have to fit inside it."]
    ]
  },
  "week-05-rate-limiter": {
    title: "Put the limit where every instance can see it",
    paragraphs: [
      "A layer-4 load balancer forwards connections and does not read the HTTP route. A layer-7 balancer, or an API gateway, can see the path and the API key. The card route and the model route can have different limits. Health checks tell the balancer which instances are alive. Slow start avoids burying a new instance with a full share of traffic in its first seconds.",
      "An in-memory limiter on each instance is wrong. Ten instances means about ten times the budget, and the load balancer spreads clients across them. Keep the token bucket in a shared store, the same kind of store as a cache, with a short TTL. Consistent hashing can pin one key to one instance, and you then have to say what happens when that instance dies. A shared bucket is the simpler defense.",
      "Sticky sessions pin a client to one instance. That hides a limiter bug and breaks as soon as the instance is replaced, which is normal in a cloud deploy. Auth does not need stickiness. The decision row is in the database."
    ],
    terms: [
      ["Layer 4", "Balances connections. It does not see the URL."],
      ["Layer 7", "Balances HTTP. It can route and limit by path and key."],
      ["Health check", "A probe. Fail it and the balancer sends no new requests there."],
      ["Sticky session", "Pins a client to one instance. A trap for auth and for limits."]
    ]
  },
  "week-05-notification-drill": {
    title: "Receipts are workers, not another hop on the card tap",
    paragraphs: [
      "The user-facing load balancer ends at the payment commit. SMS, push, and email are consumers of the queue. Scale those workers on queue depth and on provider latency. Do not scale them by making the card request wait.",
      "A provider timeout is unknown delivery. Retry the same send id. The provider's own load balancer can deliver and then fail the acknowledgement. Your send record is what stops the fourth text."
    ],
    terms: [
      ["Queue depth", "How much work is waiting. This is the signal to add workers."],
      ["Send record", "One row per user, event, and channel. The retry key lives here."]
    ]
  },
  "week-06-activity-feed": {
    title: "The feed index and a small cache",
    paragraphs: [
      "The page of recent activity is an index read: account id, then time descending, limit 20. If that index does not exist, the database sorts the account's history on every open of the app. Cache the first page for a few seconds if the home screen can be slightly stale. The next page, and pull-to-refresh, can miss the cache and read the source.",
      "Invalidating one account's first page on each new posting is enough. You do not flush a global cache. The load balancer in front of the feed service does not change this. Every instance must share the cache or skip it."
    ],
    terms: [
      ["Covering the page", "The index contains account and time, so the latest page is one lookup."],
      ["Per-account invalidation", "Drop one account's cached page when that account gets a new posting."]
    ]
  },
  "week-06-netflix-personalization": {
    title: "A cache at the edge is still a cache",
    paragraphs: [
      "Candidate generation is a batch job writing to a store. The request path is a load balancer, a stateless ranker, and a short-lived cache of the ranked row. A content delivery network, a CDN, can cache the artwork and the title metadata close to the viewer. It should not cache a personalized row for a day. A play event has to bust that row, or the member sees a title they just finished.",
      "The ranker's deadline is 100 ms. Autoscaling rankers helps when the limit is CPU. It does not help if each request scans the catalog because you skipped the precomputed candidates. Same shape for a fraud model later: heavy features ahead of time, a small fresh lookup on the request."
    ],
    terms: [
      ["CDN", "A cache near the user for bytes that are the same for many people, such as images."],
      ["Precompute", "Do the expensive scan before the request, and store the result."]
    ]
  },
  "week-07-uber-dispatch": {
    title: "The geospatial index is the lookup",
    paragraphs: [
      "Finding nearby drivers is an index problem. A grid or hex index returns the cell and its neighbors. A database scan of every driver on every request will miss the match deadline no matter how many load-balancer instances you add.",
      "Dispatch services are stateless. Driver location is a live store with an age, not a CDN and not the ledger of the fare. The fare authorization is the payment path you already know: primary, idempotency key, and a timeout that is unknown. Keep that write off the location index."
    ],
    terms: [
      ["Geo index", "Finds drivers by cell, not by scanning the fleet."],
      ["Age of a point", "How old the location is. Past a few seconds it is the wrong input for a match."]
    ]
  },
  "week-07-location-fanout-drill": {
    title: "Fan-out is a stream, not a request the balancer should retry",
    paragraphs: [
      "Phones publish points into a log partitioned by driver. Subscribers, the match service and the rider's map, read from that log or from a live store built off it. A load balancer in front of the map connection is there to hold many sockets and to shed a dead gateway. It is not there to replay the last minute of GPS as if it were a charge.",
      "Say what you drop. A late point can be discarded. A late payment webhook cannot. Cloud pub/sub will redeliver. The consumer dedupes by driver id and timestamp, or by an event id."
    ],
    terms: [
      ["Fan-out", "One point becomes updates for the match and for the people watching that trip."],
      ["Socket gateway", "Holds the phone connection. It should be stateless apart from the open connection."]
    ]
  },
  "week-08-video-delivery": {
    title: "Object storage, a CDN, and a separate origin",
    paragraphs: [
      "The upload lands in object storage, the cloud file store, not on the disk of the web instance. A transcoder is a worker pool you autoscale on queue depth. The finished files sit in object storage and are cached on a CDN. The origin is the place the CDN calls on a miss. Protect the origin with a load balancer and a cache so a popular title does not melt the store.",
      "Entitlement, whether this account may watch, is a check against your service. Cache it briefly if at all. A day-long CDN cache of the video file is fine. A day-long cache of 'this person is allowed' is how a cancelled account keeps watching. The payment for the subscription is the ledger path, not the CDN."
    ],
    terms: [
      ["Object storage", "Durable files. The right place for video, statements, and exports."],
      ["Origin", "The system the CDN falls back to on a miss."],
      ["Entitlement", "Whether this caller may see this file. Check it. Do not bake it into the file URL forever."]
    ]
  },
  "week-08-slo-and-metrics": {
    title: "The number you page on includes the balancer",
    paragraphs: [
      "The p99 the customer feels starts at the load balancer and ends at your response. A healthy CPU average on the pods can sit next to a bad tail caused by the database, the cache, or one zone. Page on the auth p99 and the error rate, separately from the model p99. The model is allowed to fail open or fail closed only in the way you named.",
      "Multi-AZ is a deployment fact you should say out loud. One zone down should look like lost capacity, not like lost data. If your only database writer lived in that zone and you had no failover, the zone was a single point of failure. Health checks must fail when the instance cannot reach the database, not only when the process is running."
    ],
    terms: [
      ["SLO", "The line you promise, such as 99 of 100 auths under 150 ms."],
      ["Single point of failure", "One place that, if lost, stops the system. Name it and say how you remove it."],
      ["Fail closed", "When unsure, refuse. Often right for money. Say it."]
    ]
  },
  "week-09-double-entry-ledger": {
    title: "One writer, the right indexes, a lock on the account",
    paragraphs: [
      "The ledger primary is a single writer even in the cloud. Replicas and a standby in another zone are for durability and failover, not for two writers accepting postings at once. Two writers without a plan is how balances diverge.",
      "Index the posting by account id and by the idempotency key, unique. The available balance is the sum of postings, or a cached sum you can rebuild and that authorization does not trust if it might be stale. The lock, or a conditional update, is on the account row so two charges cannot both read the same balance.",
      "A cloud failover promotes the standby. During that minute, stop approving or retry with the same key. Do not point authorization at a replica to 'relieve the primary.' That replica is behind."
    ],
    terms: [
      ["Single writer", "One primary accepts postings. Standbys copy. They do not also take writes."],
      ["Conditional update", "Write the debit only if the balance is still what you read. The loser retries or declines."],
      ["Standby", "A replica that can be promoted. Until then it is a follower."]
    ]
  },
  "week-09-payment-state-machine": {
    title: "The state row is what every instance reads",
    paragraphs: [
      "Authorized, captured, voided, and refunded are values in a row, with a unique payment id and a unique idempotency key. Any instance behind the load balancer can continue the payment because none of them keep the state in memory. A second capture is a second request with the same key, and the row says it already happened.",
      "The database enforces the legal edge with a conditional update: capture only if the status is still authorized. An in-memory state machine on one server forgets the payment when that server is replaced, which cloud deploys do all day."
    ],
    terms: [
      ["Conditional transition", "Update the status only from the state you expected. Otherwise someone else already moved it."],
      ["Payment id index", "The lookup for status, separate from the account balance index."]
    ]
  },
  "week-10-reconciliation": {
    title: "The file is in object storage. The fix is not a silent write.",
    paragraphs: [
      "The processor file lands in object storage. A scheduled job, not a web instance, compares it to your ledger. A streaming match can raise a break within minutes. The nightly file is the official pass. Neither job should take the user-facing load balancer's traffic.",
      "A break is a row in a queue for a human or a defined repair. Copying the file's number over your ledger because they differ destroys the audit. Cloud schedulers retry jobs. The job needs an idempotency key per file and per line so a rerun does not open two repair cases."
    ],
    terms: [
      ["Batch job", "Offline work on a file or a table. It has its own clock and its own retries."],
      ["Break", "A line where your ledger and the processor disagree. Store it. Do not erase your side."]
    ]
  },
  "week-10-fraud-decision": {
    title: "The model pool has a different scaler than the API",
    paragraphs: [
      "The auth service calls the model with a deadline inside the terminal's budget, about 40 ms inside 200 ms. The load balancer in front of the model sees long, uneven requests. Least-connections is a better spread than round-robin when some scores take longer. If the pool is empty or slow, the named fallback runs: step-up, a rules decline, or a narrow approve you can defend. Waiting is not a fallback.",
      "Cache features that are safe to be seconds old, such as the account's country. Do not cache the allow-or-deny decision. Autoscaling model instances is slow if they are large. Say the fallback for the minutes before new capacity is warm. The ledger still records what you decided and which features you used."
    ],
    terms: [
      ["Least connections", "Send the next call to the instance with the fewest in flight. Fits uneven model latency."],
      ["Warm capacity", "Instances already loaded and ready. A scaler does not give you this instantly."],
      ["Fallback", "The decision you make when the model misses its deadline. Name it before you ship."]
    ]
  },
  "week-11-wallet-payouts": {
    title: "The lock is the invariant, in one partition",
    paragraphs: [
      "No negative available balance is a conditional update on the account partition, under a lock, in the posting transaction. Checking the balance in the application server and then writing is the bug two load-balanced instances will hit at once.",
      "A payout is a row plus an outbox message to the bank. The worker can retry. The unique key on the payout id is what keeps a cloud queue's second delivery from paying twice. The wallet service stays stateless."
    ],
    terms: [
      ["Account lock", "Only one posting at a time changes this balance. Both instances must go through it."],
      ["Payout id", "The idempotency key for money leaving the wallet."]
    ]
  },
  "week-11-payment-platform-drill": {
    title: "Name the boxes a cloud reviewer expects",
    paragraphs: [
      "On the blank diagram, place a load balancer, a stateless API, a primary database with the indexes you need, a cache only where staleness is acceptable, and a queue for the webhook and for notifications. Say which availability zones the API runs in, and that there is one writer for money.",
      "Say what you will not draw: a second region that also takes charges, unless you have a story for conflicting writes. Active-active across regions is a different design. Active in one region, with a standby, is the honest first answer for a ledger."
    ],
    terms: [
      ["Active-passive", "One region takes the writes. Another can be promoted. The usual first design for money."],
      ["Active-active", "Two regions take writes. You must explain conflicts. Do not claim it in one sentence."]
    ]
  },
  "week-12-feature-platform": {
    title: "Online features and batch features are two stores",
    paragraphs: [
      "Training reads a point-in-time snapshot, often from object storage or a warehouse, built by a batch job. Serving reads a low-latency store on the request. If those definitions differ, the model sees a different world in production than in training. That is train/serve skew.",
      "The online store is allowed to be a cache with a timestamp. The card decision must know how old the feature is. A load balancer in front of the feature service does not fix a feature that was computed tomorrow in training and yesterday in serving. Partition the online store by entity id, the same way you partitioned accounts."
    ],
    terms: [
      ["Point in time", "The feature values as of the moment the decision was made, not as of now."],
      ["Train/serve skew", "The training job and the live request compute a feature differently."],
      ["Warehouse", "The offline store for scans and training. Too slow for the tap."]
    ]
  },
  "week-12-model-serving": {
    title: "Batch inside the deadline, or not on this request",
    paragraphs: [
      "A few milliseconds of waiting to fill a batch can make a model cheaper, if it still fits in the p99. A batch that waits 200 ms does not fit in a card tap. Put that batch on an async path, such as a review queue, not on the swipe.",
      "When the model pool is down, the ledger does not move by guesswork. The API returns the fallback you named and writes the reason. A cloud autoscaler adding GPU instances is a capacity plan for the next few minutes, not a rescue for the tap that is waiting now. Health-check the model with a real tiny score, not only a process-is-up probe, or the load balancer will keep sending traffic to a loaded but stuck instance."
    ],
    terms: [
      ["Request batching", "Group a few scores to use the hardware. Only if the wait fits the deadline."],
      ["Deep health check", "The probe runs the real dependency. A shallow probe only proves the process started."]
    ]
  },
  "week-13-financial-rag": {
    title: "The index is filtered before the model sees it",
    paragraphs: [
      "Documents live in object storage. The searchable index is derived: chunks, embeddings, and the account or client id on every chunk. Retrieval has to apply entitlement first, in the query, so another client's file cannot enter the prompt. A filter after the model has already spoken is too late.",
      "Cache a repeated question only for that caller, with a short TTL, and only if the source documents have a version you can invalidate. A shared cache entry without the tenant id is a data leak across customers. The chat instances stay stateless. The index is rebuilt from object storage if the cache or the index store is flushed."
    ],
    terms: [
      ["Embedding index", "Finds chunks by meaning. It is derived data. It is not the document and not the ledger."],
      ["Tenant filter", "The caller id is part of the query, applied before any chunk reaches the model."],
      ["Document version", "What you use to invalidate a cached answer when the file changes."]
    ]
  },
  "week-13-eval-and-cost": {
    title: "Eval is a batch job. Cost is a routing decision.",
    paragraphs: [
      "A fixed set of questions runs offline, on a schedule, against the candidate model. That job reads from object storage and writes a score. It does not sit on the request load balancer. You ship when citation accuracy, refusal, and tenant isolation clear a line you set. A hallway demo is not that line.",
      "On the request, a cheap model can answer the easy calls and a costly one the rest. Cache the cheap repeat. The router is stateless. The decision of which model ran is an audit field, not a secret on one instance. None of this caching may answer a balance or move money."
    ],
    terms: [
      ["Eval set", "A fixed suite you run before you ship. It includes the failure you care about, such as the wrong client's document."],
      ["Router", "Picks a small or a large model per request. It does not store the customer's ledger."]
    ]
  },
  "week-14-payment-risk-capstone": {
    title: "One diagram, every durable place named",
    paragraphs: [
      "Place these, and say which are allowed to be wrong for a moment. A load balancer and a stateless risk API in more than one zone. A feature cache that can be seconds old, with a timestamp. A model pool with a deadline and a fallback. A ledger primary with a unique key and an account lock. A queue for the processor webhook, consumed with that same key. Object storage for the case file a human reviews. A small queue for the analysts.",
      "The webhook worker, the API, and a retry from the load balancer all have to agree on the key. Autoscaling the API does not fix a duplicate webhook. A second region that also posts to the ledger is out of scope unless you draw the conflict rule."
    ],
    terms: [
      ["Durable places", "Database, queue, and object storage. Everything else can be replaced."],
      ["Fallback outcome", "What you record when the model misses the deadline. Write it next to the posting."]
    ]
  },
  "week-14-mock-interview": {
    title: "What they will interrupt you for",
    paragraphs: [
      "Expect these questions, and answer with a place on the diagram. Where does the load balancer retry, and what key does it forward? What is cached, and what happens when the cache is empty? Which index serves the balance, and which query are you willing to make slow? What is the partition key? How many writers accept a posting? What happens when one zone disappears? What does the autoscaler add, and what problem will it not solve?",
      "A strong answer is boring. Stateless services, one ledger writer, a unique key, a queue for the work after the ack, and a cache only for data you can rebuild and afford to serve stale. Cloud products are names for those roles. The role is the design. The product name is optional."
    ],
    terms: [
      ["Role", "Load balancer, cache, index, primary, queue, object storage. Name the role before the vendor."],
      ["What scaling will not fix", "A hot key, a missing index, a stale balance, a duplicate webhook."]
    ]
  }
};
