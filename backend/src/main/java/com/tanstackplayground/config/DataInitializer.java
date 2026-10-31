package com.tanstackplayground.config;

import com.tanstackplayground.entity.Library;
import com.tanstackplayground.entity.Topic;
import com.tanstackplayground.entity.User;
import com.tanstackplayground.entity.UserPreference;
import com.tanstackplayground.repository.LibraryRepository;
import com.tanstackplayground.repository.TopicRepository;
import com.tanstackplayground.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final TopicRepository topicRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        initDemoUser();
        initLibraries();
    }

    private void initDemoUser() {
        if (userRepository.findByEmail("demo@tanstack.dev").isEmpty()) {
            User demoUser = User.builder()
                    .email("demo@tanstack.dev")
                    .passwordHash(passwordEncoder.encode("password123"))
                    .displayName("Demo Developer")
                    .build();

            User saved = userRepository.save(demoUser);

            UserPreference preference = UserPreference.builder()
                    .user(saved)
                    .theme("dark")
                    .editorFontSize(13)
                    .editorWordWrap(true)
                    .previewLayout("side-by-side")
                    .build();
            saved.setPreference(preference);
            userRepository.save(saved);
            log.info("Initialized default demo user: demo@tanstack.dev (password: password123)");
        }
    }

    private void initLibraries() {
        if (libraryRepository.count() > 0) {
            return;
        }

        log.info("Seeding TanStack Ecosystem Libraries into empty database...");

        seedLibrary(
                "query",
                "TanStack Query",
                "Declarative, auto-managed asynchronous server state synchronization and caching.",
                "@tanstack/react-query",
                "Database",
                "https://tanstack.com/query/latest",
                "STABLE",
                List.of(
                        new TopicSeed("query-basics", "Basic Query: Lifecycle States", "BEGINNER", 15, 0),
                        new TopicSeed("query-keys", "Query Keys & Cache Identifiers", "BEGINNER", 20, 1),
                        new TopicSeed("query-caching", "Query Caching & Garbage Collection", "INTERMEDIATE", 25, 2),
                        new TopicSeed("stale-time", "Stale Time vs GC Time", "INTERMEDIATE", 20, 3),
                        new TopicSeed("mutations", "Mutations & Server State Changes", "INTERMEDIATE", 25, 4),
                        new TopicSeed("query-invalidation", "Query Invalidation & Re-fetching", "INTERMEDIATE", 20, 5),
                        new TopicSeed("optimistic-updates", "Optimistic Updates & Rollback", "ADVANCED", 30, 6),
                        new TopicSeed("pagination", "Pagination with keepPreviousData", "INTERMEDIATE", 25, 7),
                        new TopicSeed("infinite-queries", "Infinite Queries & Bi-directional Feeds", "ADVANCED", 35, 8),
                        new TopicSeed("dependent-queries", "Dependent & Chained Queries", "INTERMEDIATE", 20, 9),
                        new TopicSeed("parallel-queries", "Parallel & Dynamic Queries", "INTERMEDIATE", 20, 10),
                        new TopicSeed("prefetching", "Prefetching & Router Integration", "ADVANCED", 25, 11),
                        new TopicSeed("cancellation", "Query Cancellation with AbortSignal", "ADVANCED", 25, 12),
                        new TopicSeed("error-handling", "Robust Error Handling & Error Boundaries", "INTERMEDIATE", 20, 13)
                )
        );

        seedLibrary(
                "table",
                "TanStack Table",
                "Headless UI for building powerful tables and datagrids with total styling freedom.",
                "@tanstack/react-table",
                "Table",
                "https://tanstack.com/table/latest",
                "STABLE",
                List.of(
                        new TopicSeed("basic-table", "Basic Table & Column Definitions", "BEGINNER", 15, 0),
                        new TopicSeed("sorting", "Multi-Column Sorting", "BEGINNER", 20, 1),
                        new TopicSeed("filtering", "Global & Column-Level Filtering", "INTERMEDIATE", 25, 2),
                        new TopicSeed("pagination-table", "Client & Server Pagination", "INTERMEDIATE", 20, 3),
                        new TopicSeed("row-selection", "Row Selection & Batch Actions", "INTERMEDIATE", 20, 4),
                        new TopicSeed("column-visibility", "Dynamic Column Visibility & Reordering", "INTERMEDIATE", 25, 5),
                        new TopicSeed("expanding", "Row Expanding & Sub-components", "ADVANCED", 30, 6),
                        new TopicSeed("editable-cells", "Inline Editable Cells & Validation", "ADVANCED", 35, 7),
                        new TopicSeed("virtualized-table-topic", "High Performance Virtualized Table", "ADVANCED", 35, 8)
                )
        );

        seedLibrary(
                "router",
                "TanStack Router",
                "Type-safe routing with built-in search params management, loaders, and code splitting.",
                "@tanstack/react-router",
                "Network",
                "https://tanstack.com/router/latest",
                "STABLE",
                List.of(
                        new TopicSeed("route-definitions", "Type-safe Route Definitions", "BEGINNER", 15, 0),
                        new TopicSeed("dynamic-params", "Dynamic Route Parameters", "BEGINNER", 20, 1),
                        new TopicSeed("search-params", "Search Params Schema Validation with Zod", "INTERMEDIATE", 25, 2),
                        new TopicSeed("navigation", "Type-safe Navigation & Link Components", "BEGINNER", 15, 3),
                        new TopicSeed("loaders", "Route Loaders & Parallel Data Fetching", "INTERMEDIATE", 25, 4),
                        new TopicSeed("route-context", "Route Context & Dependency Injection", "INTERMEDIATE", 25, 5),
                        new TopicSeed("error-boundaries", "Error Boundaries & Not Found Handling", "INTERMEDIATE", 20, 6),
                        new TopicSeed("auth-guards", "Authentication Guards & Redirection", "ADVANCED", 30, 7),
                        new TopicSeed("query-integration", "Query Integration & Automatic Prefetching", "ADVANCED", 30, 8)
                )
        );

        seedLibrary(
                "form",
                "TanStack Form",
                "High-performance headless form state management with fine-grained reactivity.",
                "@tanstack/react-form",
                "FileCheck",
                "https://tanstack.com/form/latest",
                "STABLE",
                List.of(
                        new TopicSeed("basic-form", "Basic Form & useForm Hook", "BEGINNER", 15, 0),
                        new TopicSeed("field-validation", "Synchronous Field Validation", "BEGINNER", 20, 1),
                        new TopicSeed("form-submission", "Form Submission & State Handlers", "BEGINNER", 15, 2),
                        new TopicSeed("async-validation", "Asynchronous Validation & Debouncing", "INTERMEDIATE", 25, 3),
                        new TopicSeed("dependent-fields", "Dependent & Linked Fields", "INTERMEDIATE", 25, 4),
                        new TopicSeed("dynamic-fields", "Dynamic Field Arrays", "ADVANCED", 30, 5),
                        new TopicSeed("server-side-validation", "Server-Side Validation Mapping", "ADVANCED", 30, 6)
                )
        );

        seedLibrary(
                "virtual",
                "TanStack Virtual",
                "Headless virtualization for huge scrollable lists, grids, and tables.",
                "@tanstack/react-virtual",
                "Layers",
                "https://tanstack.com/virtual/latest",
                "STABLE",
                List.of(
                        new TopicSeed("virtual-list", "Virtual List with Fixed Row Heights", "BEGINNER", 15, 0),
                        new TopicSeed("large-dataset", "10,000+ Items Virtualization", "INTERMEDIATE", 20, 1),
                        new TopicSeed("variable-height", "Dynamic & Variable Row Heights", "INTERMEDIATE", 25, 2),
                        new TopicSeed("horizontal-virtual", "Horizontal Virtualization", "INTERMEDIATE", 20, 3),
                        new TopicSeed("grid-virtualization", "2D Grid Virtualization", "ADVANCED", 30, 4),
                        new TopicSeed("virtual-table", "Virtualized High-Volume Table", "ADVANCED", 35, 5)
                )
        );

        seedLibrary(
                "start",
                "TanStack Start",
                "Full-stack React framework powered by TanStack Router and Vite server functions.",
                "@tanstack/react-start",
                "Rocket",
                "https://tanstack.com/start/latest",
                "BETA",
                List.of(new TopicSeed("server-functions", "Server Functions & RPC", "INTERMEDIATE", 25, 0))
        );

        seedLibrary(
                "db",
                "TanStack DB",
                "Client-side reactive relational database with SQLite / Dexie persistence.",
                "@tanstack/db",
                "HardDrive",
                "https://tanstack.com/db",
                "ALPHA",
                List.of(new TopicSeed("collections", "Reactive Collections & Queries", "INTERMEDIATE", 25, 0))
        );

        seedLibrary(
                "store",
                "TanStack Store",
                "Lightweight, framework-agnostic reactive state management primitives.",
                "@tanstack/store",
                "Box",
                "https://tanstack.com/store/latest",
                "STABLE",
                List.of(new TopicSeed("store-basics", "Reactive Stores & Derived State", "BEGINNER", 15, 0))
        );

        seedLibrary(
                "pacer",
                "TanStack Pacer",
                "Rate-limiting, queuing, batching, and debouncing utilities.",
                "@tanstack/pacer",
                "Gauge",
                "https://tanstack.com/pacer",
                "BETA",
                List.of(new TopicSeed("debouncing", "Rate Limiting & Batched Queues", "BEGINNER", 15, 0))
        );

        seedLibrary(
                "devtools",
                "TanStack Devtools",
                "Universal debugging panel for inspecting Query, Router, and Table state.",
                "@tanstack/react-query-devtools",
                "Cpu",
                "https://tanstack.com",
                "STABLE",
                List.of(new TopicSeed("devtools-inspection", "Devtools Cache Inspection", "BEGINNER", 15, 0))
        );

        seedLibrary(
                "ranger",
                "TanStack Ranger",
                "Headless range and multi-thumb slider state primitives.",
                "@tanstack/react-ranger",
                "Sliders",
                "https://tanstack.com/ranger/latest",
                "STABLE",
                List.of(new TopicSeed("multi-slider", "Multi-thumb Sliders & Steps", "BEGINNER", 15, 0))
        );

        seedLibrary(
                "hotkeys",
                "TanStack Hotkeys",
                "Keyboard shortcut management with scopes and sequences.",
                "@tanstack/hotkeys",
                "Keyboard",
                "https://tanstack.com/hotkeys",
                "ALPHA",
                List.of(new TopicSeed("key-sequences", "Keyboard Shortcuts & Scopes", "BEGINNER", 15, 0))
        );

        seedLibrary(
                "ai",
                "TanStack AI",
                "Streaming LLM completions and generative UI primitives.",
                "@tanstack/ai",
                "Sparkles",
                "https://tanstack.com/ai",
                "ALPHA",
                List.of(new TopicSeed("streaming-chat", "Streaming Completions & UI", "INTERMEDIATE", 25, 0))
        );

        log.info("TanStack Ecosystem seed completed successfully.");
    }

    private void seedLibrary(
            String slug,
            String name,
            String description,
            String packageName,
            String icon,
            String documentationUrl,
            String status,
            List<TopicSeed> topics
    ) {
        Library library = Library.builder()
                .slug(slug)
                .name(name)
                .description(description)
                .packageName(packageName)
                .icon(icon)
                .documentationUrl(documentationUrl)
                .status(status)
                .build();

        Library saved = libraryRepository.save(library);

        for (TopicSeed seed : topics) {
            Topic topic = Topic.builder()
                    .library(saved)
                    .slug(seed.slug)
                    .title(seed.title)
                    .difficulty(seed.difficulty)
                    .estimatedMinutes(seed.estimatedMinutes)
                    .orderIndex(seed.orderIndex)
                    .documentationUrl(documentationUrl)
                    .build();
            topicRepository.save(topic);
        }
    }

    private record TopicSeed(String slug, String title, String difficulty, int estimatedMinutes, int orderIndex) {}
}
