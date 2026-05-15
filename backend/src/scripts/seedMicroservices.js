const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// ─── Microservices seed data ───────────────────────────────────────────────
// Each object represents one document that will be inserted into the "data"
// collection with category = "Microservices"
const microservicesDocs = [
    {
        prompt: "What is a microservice?",
        response:
            "A microservice is a small, independently deployable service that does one thing well. Unlike a monolithic application where everything is bundled together, microservices are split into separate processes that communicate over a network (usually HTTP/REST or message queues).",
        metadata: {
            category: "Microservices",
            subcategory: "Fundamentals",
            concept: "Definition",
            question_type: "conceptual",
            language: "",
            difficulty: "Beginner",
            generated_at: new Date(),
        },
    },
    {
        prompt: "What is an API Gateway in microservices?",
        response:
            "An API Gateway is a single entry point that sits in front of all your microservices. Clients talk to the gateway, and the gateway routes requests to the correct service. It can also handle cross-cutting concerns like authentication, rate limiting, and logging so each service doesn't have to.",
        metadata: {
            category: "Microservices",
            subcategory: "Patterns",
            concept: "API Gateway",
            question_type: "conceptual",
            language: "",
            difficulty: "Intermediate",
            generated_at: new Date(),
        },
    },
    {
        prompt: "What is service discovery in microservices?",
        response:
            "Service discovery is the mechanism by which microservices find each other on the network. Instead of hard-coding IP addresses, each service registers itself with a discovery server (e.g. Consul, Eureka) and looks up others by name. This makes the system resilient to services moving or scaling.",
        metadata: {
            category: "Microservices",
            subcategory: "Patterns",
            concept: "Service Discovery",
            question_type: "conceptual",
            language: "",
            difficulty: "Intermediate",
            generated_at: new Date(),
        },
    },
    {
        prompt: "What is the Circuit Breaker pattern?",
        response:
            "The Circuit Breaker pattern prevents a microservice from repeatedly calling a failing downstream service. After a threshold of failures it 'opens the circuit' and returns a fallback response immediately, giving the failing service time to recover. It's similar to an electrical circuit breaker that trips to protect the rest of the system.",
        metadata: {
            category: "Microservices",
            subcategory: "Resilience Patterns",
            concept: "Circuit Breaker",
            question_type: "design",
            language: "",
            difficulty: "Advanced",
            generated_at: new Date(),
        },
    },
    {
        prompt: "What is event-driven communication in microservices?",
        response:
            "Event-driven communication means services publish events (e.g. 'OrderPlaced') to a message broker like Kafka or RabbitMQ, and other services subscribe to events they care about. This decouples services — the publisher doesn't need to know who is listening — and improves resilience because the broker can buffer messages if a consumer is temporarily down.",
        metadata: {
            category: "Microservices",
            subcategory: "Communication",
            concept: "Event-Driven Architecture",
            question_type: "conceptual",
            language: "",
            difficulty: "Intermediate",
            generated_at: new Date(),
        },
    },
    {
        prompt: "What is the Saga pattern in microservices?",
        response:
            "The Saga pattern manages distributed transactions across multiple microservices without a single global transaction. A saga is a sequence of local transactions; if one step fails, compensating transactions are run to undo the previous steps. There are two styles: choreography (services react to events) and orchestration (a central coordinator directs the steps).",
        metadata: {
            category: "Microservices",
            subcategory: "Resilience Patterns",
            concept: "Saga Pattern",
            question_type: "design",
            language: "",
            difficulty: "Advanced",
            generated_at: new Date(),
        },
    },
    {
        prompt: "What is containerisation and how does it help microservices?",
        response:
            "Containerisation (using tools like Docker) packages a microservice and all its dependencies into a self-contained image. This ensures the service runs the same way on any machine. Containers are lightweight compared to VMs and can be started or stopped in seconds, making it easy to scale individual services independently.",
        metadata: {
            category: "Microservices",
            subcategory: "Deployment",
            concept: "Containerisation",
            question_type: "conceptual",
            language: "",
            difficulty: "Beginner",
            generated_at: new Date(),
        },
    },
    {
        prompt: "What is the Strangler Fig pattern?",
        response:
            "The Strangler Fig pattern is a migration strategy where you gradually replace a monolith with microservices. New features are built as microservices, and over time existing monolith functionality is extracted piece by piece. Eventually the monolith is 'strangled' and can be retired, reducing risk compared to a big-bang rewrite.",
        metadata: {
            category: "Microservices",
            subcategory: "Migration Patterns",
            concept: "Strangler Fig",
            question_type: "design",
            language: "",
            difficulty: "Advanced",
            generated_at: new Date(),
        },
    },
];

// ─── Seed function ─────────────────────────────────────────────────────────
async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅  Connected to MongoDB");

        // Insert all documents into the "data" collection
        const collection = mongoose.connection.db.collection("data");
        const result = await collection.insertMany(microservicesDocs);

        console.log(`✅  Inserted ${result.insertedCount} Microservices documents`);
    } catch (error) {
        console.error("❌  Error seeding Microservices data:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌  Disconnected from MongoDB");
    }
}

seed();
