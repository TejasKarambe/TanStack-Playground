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
        log.info("Ensuring TanStack Ecosystem Libraries and Topics are fully seeded with correct slugs...");

        seedLibrary(
                "query",
                "TanStack Query",
                "Declarative, auto-managed asynchronous server state synchronization and caching.",
                "@tanstack/react-query",
                "Database",
                "https://tanstack.com/query/latest",
                "STABLE",
                List.of(
                        new TopicSeed("query-basics", "Basic Query", "BEGINNER", 15, 1),
                        new TopicSeed("query-keys", "Query Keys", "BEGINNER", 20, 2),
                        new TopicSeed("query-caching", "Query Caching", "BEGINNER", 20, 3),
                        new TopicSeed("query-stale-time", "Stale Time & Garbage Collection", "INTERMEDIATE", 20, 4),
                        new TopicSeed("query-mutations", "Mutations", "BEGINNER", 20, 5),
                        new TopicSeed("query-invalidation", "Query Invalidation", "BEGINNER", 20, 6),
                        new TopicSeed("query-optimistic-updates", "Optimistic Updates", "INTERMEDIATE", 25, 7),
                        new TopicSeed("query-pagination", "Pagination", "INTERMEDIATE", 25, 8),
                        new TopicSeed("query-infinite-scroll", "Infinite Queries", "ADVANCED", 25, 9),
                        new TopicSeed("query-dependent", "Dependent Queries", "INTERMEDIATE", 20, 10),
                        new TopicSeed("query-parallel", "Parallel Queries", "INTERMEDIATE", 20, 11),
                        new TopicSeed("query-cancellation", "Query Cancellation", "ADVANCED", 20, 12)
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
                        new TopicSeed("table-basics", "Basic Table", "BEGINNER", 15, 1),
                        new TopicSeed("table-sorting", "Sorting", "BEGINNER", 20, 2),
                        new TopicSeed("table-filtering", "Filtering", "INTERMEDIATE", 20, 3),
                        new TopicSeed("table-pagination", "Pagination", "INTERMEDIATE", 20, 4),
                        new TopicSeed("table-row-selection", "Row Selection", "INTERMEDIATE", 20, 5),
                        new TopicSeed("table-column-visibility", "Column Visibility", "INTERMEDIATE", 20, 6),
                        new TopicSeed("table-column-ordering", "Column Ordering", "INTERMEDIATE", 20, 7),
                        new TopicSeed("table-grouping", "Grouping & Aggregation", "ADVANCED", 25, 8),
                        new TopicSeed("table-editable-cells", "Editable Cells", "INTERMEDIATE", 20, 9),
                        new TopicSeed("table-server-side", "Server-Side Operations", "ADVANCED", 25, 10),
                        new TopicSeed("table-virtualized", "Virtualized Table", "ADVANCED", 25, 11)
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
                        new TopicSeed("router-basics", "Basic Routes", "BEGINNER", 20, 1),
                        new TopicSeed("router-dynamic-routes", "Dynamic Route", "INTERMEDIATE", 20, 2),
                        new TopicSeed("router-search-params", "Search Parameters", "INTERMEDIATE", 25, 3),
                        new TopicSeed("router-navigation", "Programmatic Navigation", "BEGINNER", 20, 4),
                        new TopicSeed("router-loaders", "Route Loaders", "INTERMEDIATE", 20, 5),
                        new TopicSeed("router-context", "Route Context", "INTERMEDIATE", 20, 6),
                        new TopicSeed("router-errors", "Error Boundaries & 404", "INTERMEDIATE", 20, 7),
                        new TopicSeed("router-auth-guards", "Authentication Guards", "INTERMEDIATE", 20, 8),
                        new TopicSeed("router-query-integration", "TanStack Query Integration", "ADVANCED", 25, 9)
                )
        );

        seedLibrary(
                "form",
                "TanStack Form",
                "High-performance headless form state management with fine-grained reactivity.",
                "@tanstack/react-form",
                "CheckSquare",
                "https://tanstack.com/form/latest",
                "STABLE",
                List.of(
                        new TopicSeed("form-basics", "Basic Form", "BEGINNER", 15, 1),
                        new TopicSeed("form-validation", "Field Validation", "INTERMEDIATE", 20, 2),
                        new TopicSeed("form-submission", "Form Submission", "INTERMEDIATE", 20, 3),
                        new TopicSeed("form-async-validation", "Async Validation", "INTERMEDIATE", 20, 4),
                        new TopicSeed("form-dependent-fields", "Dependent Fields", "INTERMEDIATE", 20, 5),
                        new TopicSeed("form-dynamic-fields", "Dynamic Fields & Arrays", "INTERMEDIATE", 20, 6),
                        new TopicSeed("form-server-validation", "Server Error Mapping", "ADVANCED", 20, 7)
                )
        );

        seedLibrary(
                "virtual",
                "TanStack Virtual",
                "Headless DOM virtualization for 10,000+ item lists, tables, and grids at 60 FPS.",
                "@tanstack/react-virtual",
                "Layers",
                "https://tanstack.com/virtual/latest",
                "STABLE",
                List.of(
                        new TopicSeed("virtual-10k-list", "Basic Virtual List", "BEGINNER", 15, 1),
                        new TopicSeed("virtual-large-dataset", "Large Dataset (100k Items)", "INTERMEDIATE", 20, 2),
                        new TopicSeed("virtual-variable-height", "Variable-Height Rows", "INTERMEDIATE", 20, 3),
                        new TopicSeed("virtual-horizontal", "Horizontal Virtualization", "INTERMEDIATE", 20, 4),
                        new TopicSeed("virtual-grid", "2D Grid Virtualization", "ADVANCED", 25, 5),
                        new TopicSeed("virtual-table", "Virtualized Table", "ADVANCED", 20, 6)
                )
        );

        seedLibrary(
                "start",
                "TanStack Start",
                "Full-stack React framework powered by TanStack Router and Vite server functions.",
                "@tanstack/react-start",
                "Zap",
                "https://tanstack.com/start/latest",
                "RELEASE_CANDIDATE",
                List.of(
                        new TopicSeed("start-server-functions", "Server Functions RPC Simulation", "INTERMEDIATE", 20, 1),
                        new TopicSeed("start-ssr-hydration", "SSR Hydration & Metadata", "ADVANCED", 25, 2)
                )
        );

        seedLibrary(
                "db",
                "TanStack DB",
                "Local-first reactive client store designed for high-performance synchronization.",
                "@tanstack/db",
                "HardDrive",
                "https://tanstack.com",
                "RELEASE_CANDIDATE",
                List.of(new TopicSeed("db-collections", "Collections & Local Queries", "INTERMEDIATE", 20, 1))
        );

        seedLibrary(
                "store",
                "TanStack Store",
                "Lightweight, framework-agnostic reactive state management primitives.",
                "@tanstack/store",
                "Box",
                "https://tanstack.com/store/latest",
                "STABLE",
                List.of(new TopicSeed("store-basics", "Standalone Reactive State", "BEGINNER", 15, 1))
        );

        seedLibrary(
                "pacer",
                "TanStack Pacer",
                "Rate-limiting, queuing, batching, and debouncing utilities.",
                "@tanstack/pacer",
                "Gauge",
                "https://github.com/tanstack/pacer",
                "BETA",
                List.of(new TopicSeed("pacer-debouncing", "Debouncing & Task Queues", "BEGINNER", 15, 1))
        );

        seedLibrary(
                "devtools",
                "TanStack Devtools",
                "Universal debugging panel for inspecting Query, Router, and Table state.",
                "@tanstack/react-query-devtools",
                "Wrench",
                "https://tanstack.com",
                "STABLE",
                List.of(new TopicSeed("devtools-inspection", "Inspecting Query Cache & Traces", "BEGINNER", 15, 1))
        );

        seedLibrary(
                "ranger",
                "TanStack Ranger",
                "Headless range and multi-thumb slider state primitives.",
                "@tanstack/react-ranger",
                "Sliders",
                "https://tanstack.com/ranger/latest",
                "ALPHA",
                List.of(new TopicSeed("ranger-multi-slider", "Multi-Handle Sliders", "INTERMEDIATE", 15, 1))
        );

        seedLibrary(
                "hotkeys",
                "TanStack Hotkeys",
                "Keyboard shortcut management with scopes and sequences.",
                "@tanstack/react-hotkeys",
                "Keyboard",
                "https://github.com/tanstack/hotkeys",
                "BETA",
                List.of(new TopicSeed("hotkeys-sequences", "Key Combinations & Scopes", "BEGINNER", 15, 1))
        );

        seedLibrary(
                "ai",
                "TanStack AI",
                "Streaming LLM completions and generative UI primitives.",
                "@tanstack/ai",
                "Sparkles",
                "https://github.com/tanstack/ai",
                "RELEASE_CANDIDATE",
                List.of(new TopicSeed("ai-tool-streams", "Streaming Tool Invocations", "ADVANCED", 20, 1))
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
        Library library = libraryRepository.findBySlug(slug)
                .orElseGet(() -> libraryRepository.save(Library.builder()
                        .slug(slug)
                        .name(name)
                        .description(description)
                        .packageName(packageName)
                        .icon(icon)
                        .documentationUrl(documentationUrl)
                        .status(status)
                        .build()));

        for (TopicSeed seed : topics) {
            if (topicRepository.findBySlug(seed.slug).isEmpty()) {
                Topic topic = Topic.builder()
                        .library(library)
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
    }

    private record TopicSeed(String slug, String title, String difficulty, int estimatedMinutes, int orderIndex) {}
}
