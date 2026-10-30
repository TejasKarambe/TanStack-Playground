-- V1__initial_schema.sql
-- TanStack Playground Relational Schema with UUID Primary Keys

CREATE TABLE libraries (
    id UUID PRIMARY KEY,
    slug VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    package_name VARCHAR(120) NOT NULL,
    icon VARCHAR(60),
    documentation_url VARCHAR(512),
    status VARCHAR(30) NOT NULL DEFAULT 'STABLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topics (
    id UUID PRIMARY KEY,
    library_id UUID NOT NULL REFERENCES libraries(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(160) NOT NULL,
    description TEXT,
    difficulty VARCHAR(30) NOT NULL DEFAULT 'BEGINNER',
    estimated_minutes INTEGER NOT NULL DEFAULT 15,
    order_index INTEGER NOT NULL DEFAULT 0,
    documentation_url VARCHAR(512),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_library_topic_order UNIQUE (library_id, order_index)
);

CREATE TABLE topic_contents (
    id UUID PRIMARY KEY,
    topic_id UUID NOT NULL UNIQUE REFERENCES topics(id) ON DELETE CASCADE,
    introduction TEXT,
    learning_objectives TEXT,
    explanation TEXT,
    key_concepts TEXT,
    example_notes TEXT
);

CREATE TABLE examples (
    id UUID PRIMARY KEY,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    description TEXT,
    difficulty VARCHAR(30) NOT NULL DEFAULT 'BEGINNER',
    default_file VARCHAR(255) NOT NULL DEFAULT '/App.tsx',
    dependencies_json TEXT NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE example_files (
    id UUID PRIMARY KEY,
    example_id UUID NOT NULL REFERENCES examples(id) ON DELETE CASCADE,
    file_name VARCHAR(120) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    language VARCHAR(30) NOT NULL DEFAULT 'typescript',
    source_code TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT uq_example_file_path UNIQUE (example_id, file_path)
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_progress (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_visited_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_user_topic_progress UNIQUE (user_id, topic_id)
);

CREATE TABLE bookmarks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_topic_bookmark UNIQUE (user_id, topic_id)
);

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) NOT NULL DEFAULT 'dark',
    editor_font_size INTEGER NOT NULL DEFAULT 14,
    editor_word_wrap BOOLEAN NOT NULL DEFAULT TRUE,
    preview_layout VARCHAR(30) NOT NULL DEFAULT 'side-by-side',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Frequently Queried Indexes
CREATE INDEX idx_topics_library_order ON topics(library_id, order_index ASC);
CREATE INDEX idx_examples_topic ON examples(topic_id);
CREATE INDEX idx_example_files_example ON example_files(example_id, order_index ASC);
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id, created_at DESC);

