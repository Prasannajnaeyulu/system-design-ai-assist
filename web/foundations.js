window.FOUNDATIONS = [
  {
    file: "foundation-data-models",
    weekLabel: "Foundations",
    title: "Data models and access patterns",
    minutes: "90 min",
    company: "JPMorgan Chase / Google",
    timed: false,
    plain: "One job. You are storing three different facts, and one way of storing data will not fit all of them. Say where the money lives, where a monthly statement lives, and where “who may act for this company” lives. Then name one question you are willing to make slow, such as a report across every customer.",
    brief: "A customer has an account. Money moves in and out. Once a month they open a statement and read it. Someone at a company may be allowed to pay from that account, and someone else may not. Those are three different facts.",
    goal: "Say which facts are rows with constraints, which are documents, and which are relationships. Name the query that would be painful in the model you rejected.",
    idea: "The money record has to make two charges agree: debits equal credits, and an account must exist. A relational table is the usual way to get that atomic update and that audit trail. It is not the only store that can do a conditional write. A document is a good home for a statement you read as a whole. A graph is a good home for 'who can approve for this company,' where the question walks several hops. Pick the shape from the rule you must enforce.",
    ddiaTitle: "DDIA chapter 2 — Data models and query languages",
    ddiaBody: "Chapter 2 asks which shape owns the facts. The model you pick decides which questions are one lookup and which questions are a project. There is no model that makes every question cheap.",
    barTitle: "Who is grading this hour",
    barBody: "Google asks which access pattern is primary. JPMorgan Chase asks who is allowed to see which account, and that answer has to be a real relationship, not a paragraph in a prompt.",
    caseBody: "Uber's payments platform treats the ledger as the system of record and keeps the order of money as durable facts, not as a document you edit in place. Read it for that choice. Do not copy their services. The reusable lesson is: money is rows with a zero-sum invariant. A merchant profile can be a document. The permission to act for a company is a relationship.",
    caseUrl: "https://www.uber.com/us/en/blog/ubers-payments-platform/",
    caseLink: "Uber — Zero-Sum by Design: 10 years of the payments platform",
    codeLab: "",
    sealed: "",
    numbers: [
      { value: "4", label: "Facts to place" },
      { value: "1", label: "Primary query" },
      { value: "0", label: "Models that fit every query" },
      { value: "7 yr", label: "How long a posting is kept" }
    ],
    tableHeaders: ["Fact", "Question you must answer fast", "Shape that fits"],
    tableRows: [
      ["Posting", "Does this account's entries still sum correctly?", "Rows and a constraint"],
      ["Statement", "Show this month's document as it was generated", "A document, immutable"],
      ["Who may act", "Can this person approve for that company?", "A relationship you can walk"]
    ],
    words: [
      ["Access pattern", "The question the system must answer, including what it filters and what it returns."],
      ["Relational", "Rows, keys, and constraints. Strong when facts must agree with each other."],
      ["Document", "One self-contained record you usually read whole. Weak when you need many-way constraints."],
      ["Graph", "Entities and edges. Fits hops such as permission and ownership."]
    ],
    choices: [
      {
        id: "money",
        prompt: "Where do postings live?",
        sound: "rows",
        staff: "Rows, with a constraint that entries balance and that the account exists. A document you update in place makes the invariant a hope.",
        options: [
          { value: "rows", label: "Rows with constraints.", effect: "Two writers cannot both 'edit the balance blob' and both succeed silently." },
          { value: "doc", label: "One JSON document per account, edited in place.", effect: "The last write wins. A concurrent charge can erase the other." },
          { value: "graph", label: "Only a graph of people and merchants.", effect: "You can walk relationships and still have nowhere to enforce a zero sum." }
        ]
      },
      {
        id: "pain",
        prompt: "Which query are you willing to make slow?",
        sound: "analytics",
        staff: "The monthly analytics scan can be slow and offline. The 'balance of this account' and 'may this person act' queries cannot.",
        options: [
          { value: "analytics", label: "Cross-account analytics. It runs offline.", effect: "The tap stays fast. The warehouse is allowed to be hours behind." },
          { value: "balance", label: "The single-account balance. Analytics must be instant.", effect: "You optimized the scan and made the payment path the slow one." },
          { value: "both", label: "Neither. Every query is equally fast.", effect: "That is not a design. It is a wish." }
        ]
      }
    ],
    failureTitle: "Two charges edit the same account document",
    failureBody: "Both requests read the document, subtract, and write it back. One subtraction disappears. Say which model makes that write fail instead of silently dropping money, and what the caller should retry with.",
    reviewIntro: "One defensible split: postings in rows, statements as immutable documents, permissions in a relationship you can query. Analytics is a derived copy.",
    review: [
      "The source of truth for money is the posting table. A document store can hold the statement because you do not add numbers inside it. The graph answers permission hops. If those stores disagree, the posting table wins for money and the permission store wins for who may act.",
      "The failure is a lost update. A conditional write, or a single-row update in the database, makes the second charge retry. A new idempotency key would apply both. The tradeoff is more structure up front so the invariant is enforced by the store, not by a careful client."
    ],
    rubric: [
      ["Scope", "Postings, statements, and permissions are different facts"],
      ["Estimates", "You named which query is on the request and which is offline"],
      ["Source of truth", "Money has an atomic invariant and an audit trail. The document is a copy of a statement"],
      ["Diagram", "The request path reads the posting store, not the warehouse"],
      ["Deep dive", "The lost update on a shared document"],
      ["Failure", "The second write fails and retries with the same key"],
      ["Tradeoff", "A slower analytics path, a strict money path"]
    ]
  },
  {
    file: "foundation-storage",
    weekLabel: "Foundations",
    title: "Storage, indexes, and the log",
    minutes: "90 min",
    company: "Visa / Google",
    timed: false,
    brief: "The ledger is written on every capture. The statement history is read far more often than it is written. Nightly analytics scans months of postings. Choose storage properties for those three jobs. Do not name a vendor until you have named the property.",
    goal: "Explain what an index costs on the write, why a log-structured store likes writes, and why a B-tree likes the point lookup a card authorization makes.",
    idea: "A B-tree tends to keep data sorted in pages, so a point read of one account is a short walk. A log-structured merge tree tends to write sequentially and compact in the background, so a write-heavy log often costs less up front and a read may check several files. Those are tendencies, not laws. Compaction, cache, and the real workload decide. Analytics wants a scan of columns, not a tree of random account lookups. That is a different store, filled from the ledger, not the ledger itself.",
    ddiaTitle: "DDIA chapter 3 — Storage and retrieval",
    ddiaBody: "Chapter 3 is about the cost of a write versus the cost of a read, and about indexes as extra structures you maintain. An index speeds one question and slows every write that must update it. OLTP is the many small lookups. Analytics is the large scan. They are different engines for a reason.",
    barTitle: "Who is grading this hour",
    barBody: "Google asks what the index costs and which query it serves. Visa asks whether the authorization lookup is one account read on the primary, not a scan.",
    caseBody: "Netflix's key-value abstraction hides several storage engines behind one API because different data has different consistency and access needs. Read it for the boundary, not for the engine list. Do not invent a key-value layer for a ledger. A ledger's primary question is a constrained update of one account, which wants an index and a transaction.",
    caseUrl: "https://netflixtechblog.com/introducing-netflixs-key-value-data-abstraction-layer-1ea8a0a11b30",
    caseLink: "Netflix Technology Blog — Key-Value Data Abstraction Layer",
    codeLab: "",
    sealed: "",
    numbers: [
      { value: "1 account", label: "The auth lookup" },
      { value: "Every capture", label: "How often the ledger writes" },
      { value: "Nightly", label: "When analytics may run" },
      { value: "1 index", label: "You must name its query" }
    ],
    tableHeaders: ["Job", "Read or write", "Property you need"],
    tableRows: [
      ["Authorization", "Read one account, then a small write", "Point lookup and a transaction"],
      ["Capture log", "Append, in order", "A cheap sequential write"],
      ["Analytics", "Scan months", "A columnar copy, not the primary"]
    ],
    words: [
      ["B-tree", "Sorted pages. Fast point lookup. Writes can cause page splits."],
      ["LSM", "Write to a log, compact later. Fast writes. Reads and compaction cost more."],
      ["Secondary index", "Another structure you update on every write so a different question is fast."],
      ["OLTP", "Many small online lookups and updates. The payment path."],
      ["Analytics store", "A scan-shaped copy. It can lag. It is not the source of truth."]
    ],
    choices: [
      {
        id: "auth-store",
        prompt: "What property does the authorization lookup need?",
        sound: "point",
        staff: "A point read of one account under a transaction, with an index on account id. A scan engine and an unindexed table both miss the deadline.",
        options: [
          { value: "point", label: "An index and a short point read on the primary.", effect: "The tap looks up one account. The write updates that index." },
          { value: "scan", label: "Scan recent postings on every authorization.", effect: "The deadline dies as history grows, no matter how many app instances you add." },
          { value: "column", label: "Read the analytics copy. It is cheaper.", effect: "The copy lags. You can approve a card against yesterday's balance." }
        ]
      },
      {
        id: "index-cost",
        prompt: "You add an index on merchant id. What did you just make slower?",
        sound: "writes",
        staff: "Every posting write must maintain that index. You bought a merchant question and paid for it on the capture path. Say whether that question is on the request.",
        options: [
          { value: "writes", label: "The capture write. The index is updated every time.", effect: "Merchant reports get faster. The payment write does more work." },
          { value: "nothing", label: "Nothing. Indexes are free.", effect: "They are not. The write amplification shows up at peak." },
          { value: "reads", label: "Only account reads.", effect: "The account primary key was already there. The new index is a different question." }
        ]
      }
    ],
    failureTitle: "The merchant report index is on the payment primary",
    failureBody: "Captures slow down at the holiday peak because every posting updates three secondary indexes nobody uses on the request path. Say which index you would keep on the primary, and which question you would move to a derived store.",
    reviewIntro: "Keep the account index on the writer. Build merchant and analytics questions from a log or a replica, and accept that they lag.",
    review: [
      "Authorization uses the primary key on account id. One extra unique index holds the idempotency key. Merchant history and analytics are derived. They can be an LSM-shaped log or a columnar store. They must not be on the synchronous capture if the peak cannot afford the extra index maintenance.",
      "The failure is write amplification. Dropping a secondary index from the payment transaction makes captures fast again and makes the merchant report eventually consistent. Say that tradeoff. Do not promise both."
    ],
    rubric: [
      ["Scope", "Auth lookup, capture write, and analytics are separate jobs"],
      ["Estimates", "You said the auth read is one account, not a scan"],
      ["Source of truth", "The primary ledger. Analytics is derived"],
      ["Diagram", "The tap hits the indexed primary. The scan does not"],
      ["Deep dive", "What the extra index costs on the write"],
      ["Failure", "Peak captures slow because of unused indexes"],
      ["Tradeoff", "A lagging merchant report, a fast capture"]
    ]
  },
  {
    file: "foundation-schema",
    weekLabel: "Foundations",
    title: "Schema change while payments are in flight",
    minutes: "90 min",
    company: "Capital One / Microsoft",
    timed: false,
    brief: "You are adding a field to the payment event: the merchant category. Old app instances are still running. A queue already holds events written yesterday. A replay tomorrow will read both shapes. Design the change so a rolling deploy does not drop captures or misread history.",
    goal: "Make the new consumer able to read the old event, and the old consumer able to ignore the new field. Say what you do with a replay.",
    idea: "A rolling deploy means two versions of your service run at once. If the new code refuses an event without the new field, the old producers break the new consumers. If the old code crashes on an unknown field, the new producers break the old consumers. Compatible evolution means new fields are optional and old fields keep their meaning. Whether an old reader ignores an unknown field depends on the contract: Protobuf and Avro can be written that way, and unconstrained JSON will not do it for you. Replaying a year of events must still parse. A database migration that rewrites the ledger in place, while authorizations are landing, is how you lose a day of postings.",
    ddiaTitle: "DDIA chapter 4 — Encoding and evolution",
    ddiaBody: "Chapter 4 is about data outliving the code that wrote it. Rolling upgrades, a queue, and a replay all require backward compatibility, a new reader understanding old data, and usually forward compatibility, an old reader tolerating new data.",
    barTitle: "Who is grading this hour",
    barBody: "Microsoft asks what happens during the rolling deploy. Capital One asks whether a replay of last month's authorizations still decodes, and whether the ledger itself was rewritten.",
    caseBody: "The same payments platform has to keep historical orders readable while the platform changes around them. The lesson to take is compatibility of the record, not their schema language. Do not treat a queue as a place where you can change the event shape overnight. Events already in the queue are old producers you cannot redeploy.",
    caseUrl: "https://www.uber.com/us/en/blog/ubers-payments-platform/",
    caseLink: "Uber — payments platform, on keeping the record intact",
    codeLab: "",
    sealed: "",
    numbers: [
      { value: "2", label: "Versions running during the deploy" },
      { value: "Hours", label: "How long old events sit in the queue" },
      { value: "Years", label: "How long you may replay" },
      { value: "0", label: "Rewrites of posted ledger rows" }
    ],
    tableHeaders: ["Writer", "Reader", "What must work"],
    tableRows: [
      ["Old producer", "New consumer", "Missing field has a default"],
      ["New producer", "Old consumer", "Unknown field is ignored"],
      ["Replay", "Today's consumer", "Yesterday's bytes still decode"]
    ],
    words: [
      ["Backward compatible", "New code can read data written by old code."],
      ["Forward compatible", "Old code can tolerate data written by new code."],
      ["Rolling deploy", "Old and new instances serve traffic at the same time."],
      ["Replay", "Reading historical events again. They will not be rewritten to the new shape."]
    ],
    choices: [
      {
        id: "field",
        prompt: "How do you add merchant category?",
        sound: "optional",
        staff: "Add an optional field. Old events mean 'unknown.' New writers fill it. Old readers skip it. A required field with no default breaks the queue and the replay.",
        options: [
          { value: "optional", label: "Optional field. Old events default to unknown.", effect: "Both versions keep processing. History still decodes." },
          { value: "required", label: "Required immediately. Reject events without it.", effect: "The backlog of old events becomes poison, and captures stall." },
          { value: "rewrite", label: "Rewrite every stored event to add the field.", effect: "You lock or rewrite the log while payments are landing. That is an outage." }
        ]
      },
      {
        id: "ledger",
        prompt: "May the migration update posted ledger rows?",
        sound: "no",
        staff: "No. A posted entry is immutable. Put the new attribute beside it, or on new entries only. Rewriting history destroys the audit.",
        options: [
          { value: "no", label: "No. New entries carry it. Old entries stay as posted.", effect: "The audit still matches what was true that day." },
          { value: "yes", label: "Yes. Backfill the category onto old postings.", effect: "You have changed history. Reconciliation against that day no longer matches." },
          { value: "either", label: "Either, if the database transaction is fast.", effect: "Speed does not make a rewritten posting honest." }
        ]
      }
    ],
    failureTitle: "The new consumer meets a day of old events",
    failureBody: "You deploy the consumer first. The queue still holds events without merchant category, written by instances that have not restarted. The new consumer throws, retries, and the queue stops. Say the compatible read, and what you do with the poison pile you already created.",
    reviewIntro: "Deploy a reader that tolerates the missing field before any writer starts sending it. Never rewrite posted entries.",
    review: [
      "The new consumer treats a missing category as unknown and commits its work. Then you deploy writers. Old consumers ignore the field. A replay uses the same rule, so a year-old event still parses. The ledger rows that were posted stay byte-for-byte. The category for a new capture is a column on new rows only.",
      "The failure is a breaking read plus a retry loop. Park the events that already poisoned, fix the reader, and replay them once. Do not drop them: they are captures. The tradeoff is a period where category is unknown, which is acceptable, against a stalled queue, which is not."
    ],
    rubric: [
      ["Scope", "Deploy overlap, the queue backlog, and replay"],
      ["Estimates", "You treated the backlog as hours of old bytes, not as empty"],
      ["Source of truth", "Posted rows are immutable. The new field is additive"],
      ["Diagram", "Reader tolerates old data before writers send new data"],
      ["Deep dive", "The consumer that throws on a missing field"],
      ["Failure", "Old events are read as unknown and processed once"],
      ["Tradeoff", "Unknown category for a while, no stalled captures"]
    ]
  }
];
