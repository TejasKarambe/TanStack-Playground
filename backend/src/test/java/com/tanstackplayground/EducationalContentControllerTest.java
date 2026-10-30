package com.tanstackplayground;

import com.tanstackplayground.entity.*;
import com.tanstackplayground.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EducationalContentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private LibraryRepository libraryRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private TopicContentRepository topicContentRepository;

    @Autowired
    private ExampleRepository exampleRepository;

    @Autowired
    private ExampleFileRepository exampleFileRepository;

    private Library savedLibrary;
    private Topic savedTopic;
    private Example savedExample;

    @BeforeEach
    void setUp() {
        exampleFileRepository.deleteAll();
        exampleRepository.deleteAll();
        topicContentRepository.deleteAll();
        topicRepository.deleteAll();
        libraryRepository.deleteAll();

        // Seed Library
        Library library = Library.builder()
                .slug("query")
                .name("TanStack Query")
                .description("Powerful asynchronous state management and server-state caching for TS/JS.")
                .packageName("@tanstack/react-query")
                .icon("Database")
                .documentationUrl("https://tanstack.com/query/latest")
                .status("STABLE")
                .build();
        savedLibrary = libraryRepository.save(library);

        // Seed Topic
        Topic topic = Topic.builder()
                .library(savedLibrary)
                .slug("use-query-basics")
                .title("Query Basics: useQuery and Stale-While-Revalidate")
                .description("Learn how useQuery fetches, caches, and automatically updates asynchronous data.")
                .difficulty("BEGINNER")
                .estimatedMinutes(15)
                .orderIndex(1)
                .documentationUrl("https://tanstack.com/query/latest/docs/framework/react/guides/queries")
                .build();
        savedTopic = topicRepository.save(topic);

        // Seed Topic Content
        TopicContent content = TopicContent.builder()
                .topic(savedTopic)
                .introduction("TanStack Query declarative data fetching.")
                .learningObjectives("- Declare queries with unique keys\n- Understand staleTime vs gcTime")
                .explanation("When invoking useQuery, TanStack Query first returns cached data if available.")
                .keyConcepts("queryKey, queryFn, status, error, data, isFetching")
                .exampleNotes("Observe the network request status in the preview.")
                .build();
        topicContentRepository.save(content);

        // Seed Example
        Example example = Example.builder()
                .topic(savedTopic)
                .title("Basic useQuery Demo")
                .description("A live example demonstrating useQuery with mock API.")
                .difficulty("BEGINNER")
                .defaultFile("/App.tsx")
                .dependenciesJson("{\"@tanstack/react-query\":\"^5.66.0\"}")
                .isActive(true)
                .build();
        savedExample = exampleRepository.save(example);

        // Seed Example Files
        ExampleFile file1 = ExampleFile.builder()
                .example(savedExample)
                .fileName("App.tsx")
                .filePath("/App.tsx")
                .language("typescript")
                .sourceCode("import React from 'react';\nexport default function App() { return <div>TanStack Query</div>; }")
                .orderIndex(1)
                .build();
        exampleFileRepository.save(file1);
    }

    @Test
    void testGetAllLibrariesPublicly() throws Exception {
        mockMvc.perform(get("/api/libraries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].slug").value("query"))
                .andExpect(jsonPath("$[0].topicCount").value(1));
    }

    @Test
    void testGetLibraryBySlug() throws Exception {
        mockMvc.perform(get("/api/libraries/query"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("query"))
                .andExpect(jsonPath("$.packageName").value("@tanstack/react-query"));
    }

    @Test
    void testGetTopicsByLibrarySlug() throws Exception {
        mockMvc.perform(get("/api/libraries/query/topics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].slug").value("use-query-basics"));
    }

    @Test
    void testGetTopicBySlug() throws Exception {
        mockMvc.perform(get("/api/topics/use-query-basics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("use-query-basics"))
                .andExpect(jsonPath("$.difficulty").value("BEGINNER"));
    }

    @Test
    void testGetTopicContent() throws Exception {
        mockMvc.perform(get("/api/topics/use-query-basics/content"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topicSlug").value("use-query-basics"))
                .andExpect(jsonPath("$.keyConcepts").value(containsString("queryKey")));
    }

    @Test
    void testGetTopicExamples() throws Exception {
        mockMvc.perform(get("/api/topics/use-query-basics/examples"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Basic useQuery Demo"))
                .andExpect(jsonPath("$[0].files", hasSize(1)));
    }

    @Test
    void testGetExampleById() throws Exception {
        mockMvc.perform(get("/api/examples/" + savedExample.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Basic useQuery Demo"))
                .andExpect(jsonPath("$.defaultFile").value("/App.tsx"));
    }

    @Test
    void testGetExampleFiles() throws Exception {
        mockMvc.perform(get("/api/examples/" + savedExample.getId() + "/files"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].fileName").value("App.tsx"));
    }
}

