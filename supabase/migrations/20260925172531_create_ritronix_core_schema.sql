/*
# Ritronix Ai — Core Platform Schema

## Overview
Creates the foundational multi-tenant schema for the Ritronix Ai platform.
All tenant data is workspace-scoped with Row Level Security.

## New Tables
1. `workspaces` — Tenant workspaces (organizations)
2. `projects` — User projects (websites, apps, workflows)
3. `project_files` — Files within a project
4. `project_versions` — Versioned snapshots of projects
5. `conversations` — AI chat conversations
6. `messages` — Individual messages within conversations
7. `agents` — AI agent configurations
8. `agent_runs` — Execution records for agents
9. `workflows` — Visual workflow definitions
10. `workflow_runs` — Workflow execution records
11. `deployments` — Deployment records
12. `domains` — Custom domain configurations
13. `audit_logs` — Security audit trail

## Security
- RLS enabled on every table
- All tables scoped to workspace ownership via auth.uid()
- Owner columns default to auth.uid() for safe inserts
*/

-- Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_workspaces" ON workspaces;
CREATE POLICY "select_own_workspaces" ON workspaces FOR SELECT
  TO authenticated USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "insert_own_workspaces" ON workspaces;
CREATE POLICY "insert_own_workspaces" ON workspaces FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "update_own_workspaces" ON workspaces;
CREATE POLICY "update_own_workspaces" ON workspaces FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "delete_own_workspaces" ON workspaces;
CREATE POLICY "delete_own_workspaces" ON workspaces FOR DELETE
  TO authenticated USING (auth.uid() = owner_id);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'website',
  status text NOT NULL DEFAULT 'draft',
  framework text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = projects.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = projects.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects" ON projects FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = projects.workspace_id AND workspaces.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = projects.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects" ON projects FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = projects.workspace_id AND workspaces.owner_id = auth.uid())
  );

-- Project files
CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  path text NOT NULL,
  content text,
  language text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, path)
);
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_project_files" ON project_files;
CREATE POLICY "select_own_project_files" ON project_files FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = project_files.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_project_files" ON project_files;
CREATE POLICY "insert_own_project_files" ON project_files FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = project_files.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_project_files" ON project_files;
CREATE POLICY "update_own_project_files" ON project_files FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = project_files.project_id AND workspaces.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = project_files.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_project_files" ON project_files;
CREATE POLICY "delete_own_project_files" ON project_files FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = project_files.project_id AND workspaces.owner_id = auth.uid())
  );

-- Project versions
CREATE TABLE IF NOT EXISTS project_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  snapshot jsonb NOT NULL,
  label text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_project_versions" ON project_versions;
CREATE POLICY "select_own_project_versions" ON project_versions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = project_versions.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_project_versions" ON project_versions;
CREATE POLICY "insert_own_project_versions" ON project_versions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = project_versions.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_project_versions" ON project_versions;
CREATE POLICY "delete_own_project_versions" ON project_versions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = project_versions.project_id AND workspaces.owner_id = auth.uid())
  );

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'New Conversation',
  model text DEFAULT 'gemini-1.5-flash',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_conversations" ON conversations;
CREATE POLICY "select_own_conversations" ON conversations FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = conversations.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_conversations" ON conversations;
CREATE POLICY "insert_own_conversations" ON conversations FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = conversations.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_conversations" ON conversations;
CREATE POLICY "update_own_conversations" ON conversations FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = conversations.workspace_id AND workspaces.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = conversations.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_conversations" ON conversations;
CREATE POLICY "delete_own_conversations" ON conversations FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = conversations.workspace_id AND workspaces.owner_id = auth.uid())
  );

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_messages" ON messages;
CREATE POLICY "select_own_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM conversations JOIN workspaces ON workspaces.id = conversations.workspace_id
    WHERE conversations.id = messages.conversation_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM conversations JOIN workspaces ON workspaces.id = conversations.workspace_id
    WHERE conversations.id = messages.conversation_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_messages" ON messages;
CREATE POLICY "delete_own_messages" ON messages FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM conversations JOIN workspaces ON workspaces.id = conversations.workspace_id
    WHERE conversations.id = messages.conversation_id AND workspaces.owner_id = auth.uid())
  );

-- Agents
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,
  system_prompt text,
  tools text[] DEFAULT '{}',
  max_steps integer DEFAULT 15,
  status text DEFAULT 'idle',
  icon text DEFAULT 'Bot',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_agents" ON agents;
CREATE POLICY "select_own_agents" ON agents FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = agents.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_agents" ON agents;
CREATE POLICY "insert_own_agents" ON agents FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = agents.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_agents" ON agents;
CREATE POLICY "update_own_agents" ON agents FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = agents.workspace_id AND workspaces.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = agents.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_agents" ON agents;
CREATE POLICY "delete_own_agents" ON agents FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = agents.workspace_id AND workspaces.owner_id = auth.uid())
  );

-- Agent runs
CREATE TABLE IF NOT EXISTS agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('created','queued','running','waiting_for_approval','completed','failed','cancelled')),
  goal text,
  result jsonb,
  steps_taken integer DEFAULT 0,
  tokens_used integer DEFAULT 0,
  cost_usd numeric(10,4) DEFAULT 0,
  error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_agent_runs" ON agent_runs;
CREATE POLICY "select_own_agent_runs" ON agent_runs FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM agents JOIN workspaces ON workspaces.id = agents.workspace_id
    WHERE agents.id = agent_runs.agent_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_agent_runs" ON agent_runs;
CREATE POLICY "insert_own_agent_runs" ON agent_runs FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM agents JOIN workspaces ON workspaces.id = agents.workspace_id
    WHERE agents.id = agent_runs.agent_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_agent_runs" ON agent_runs;
CREATE POLICY "update_own_agent_runs" ON agent_runs FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM agents JOIN workspaces ON workspaces.id = agents.workspace_id
    WHERE agents.id = agent_runs.agent_id AND workspaces.owner_id = auth.uid())
  );

-- Workflows
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  nodes jsonb NOT NULL DEFAULT '[]',
  edges jsonb NOT NULL DEFAULT '[]',
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_workflows" ON workflows;
CREATE POLICY "select_own_workflows" ON workflows FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = workflows.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_workflows" ON workflows;
CREATE POLICY "insert_own_workflows" ON workflows FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = workflows.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_workflows" ON workflows;
CREATE POLICY "update_own_workflows" ON workflows FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = workflows.workspace_id AND workspaces.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = workflows.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_workflows" ON workflows;
CREATE POLICY "delete_own_workflows" ON workflows FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = workflows.workspace_id AND workspaces.owner_id = auth.uid())
  );

-- Workflow runs
CREATE TABLE IF NOT EXISTS workflow_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued',
  trigger_data jsonb,
  result jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_workflow_runs" ON workflow_runs;
CREATE POLICY "select_own_workflow_runs" ON workflow_runs FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workflows JOIN workspaces ON workspaces.id = workflows.workspace_id
    WHERE workflows.id = workflow_runs.workflow_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_workflow_runs" ON workflow_runs;
CREATE POLICY "insert_own_workflow_runs" ON workflow_runs FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM workflows JOIN workspaces ON workspaces.id = workflows.workspace_id
    WHERE workflows.id = workflow_runs.workflow_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_workflow_runs" ON workflow_runs;
CREATE POLICY "update_own_workflow_runs" ON workflow_runs FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workflows JOIN workspaces ON workspaces.id = workflows.workspace_id
    WHERE workflows.id = workflow_runs.workflow_id AND workspaces.owner_id = auth.uid())
  );

-- Deployments
CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'vercel',
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','building','validating','deploying','live','failed','cancelled')),
  url text,
  commit_sha text,
  build_logs text,
  duration_seconds integer,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_deployments" ON deployments;
CREATE POLICY "select_own_deployments" ON deployments FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = deployments.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_deployments" ON deployments;
CREATE POLICY "insert_own_deployments" ON deployments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = deployments.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_deployments" ON deployments;
CREATE POLICY "update_own_deployments" ON deployments FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = deployments.project_id AND workspaces.owner_id = auth.uid())
  );

-- Domains
CREATE TABLE IF NOT EXISTS domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  domain text NOT NULL,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','failed')),
  ssl_status text DEFAULT 'pending' CHECK (ssl_status IN ('pending','active','failed')),
  dns_records jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_domains" ON domains;
CREATE POLICY "select_own_domains" ON domains FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = domains.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_domains" ON domains;
CREATE POLICY "insert_own_domains" ON domains FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = domains.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_domains" ON domains;
CREATE POLICY "update_own_domains" ON domains FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = domains.project_id AND workspaces.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = domains.project_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_domains" ON domains;
CREATE POLICY "delete_own_domains" ON domains FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects JOIN workspaces ON workspaces.id = projects.workspace_id
    WHERE projects.id = domains.project_id AND workspaces.owner_id = auth.uid())
  );

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_audit_logs" ON audit_logs;
CREATE POLICY "select_own_audit_logs" ON audit_logs FOR SELECT
  TO authenticated USING (
    workspace_id IS NULL OR
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = audit_logs.workspace_id AND workspaces.owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_audit_logs" ON audit_logs;
CREATE POLICY "insert_own_audit_logs" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (
    workspace_id IS NULL OR
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = audit_logs.workspace_id AND workspaces.owner_id = auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_project_files_project ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_versions_project ON project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_agents_workspace ON agents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent ON agent_runs(agent_id);
CREATE INDEX IF NOT EXISTS idx_workflows_workspace ON workflows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_deployments_project ON deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_domains_project ON domains(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace ON audit_logs(workspace_id);
