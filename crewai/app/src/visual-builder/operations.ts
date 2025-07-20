import { HttpError } from 'wasp/server';
import type { 
  SaveWorkflow, 
  UpdateWorkflow, 
  DeleteWorkflow, 
  GetUserWorkflows, 
  GetWorkflowById 
} from 'wasp/server/operations';
import type { Workflow } from 'wasp/entities';

export const saveWorkflow: SaveWorkflow<{
  name: string;
  description?: string;
  nodes: any;
  edges: any;
}, Workflow> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  return context.entities.Workflow.create({
    data: {
      name: args.name,
      description: args.description,
      nodes: args.nodes,
      edges: args.edges,
      userId: context.user.id,
    },
  });
};

export const updateWorkflow: UpdateWorkflow<{
  id: string;
  name?: string;
  description?: string;
  nodes?: any;
  edges?: any;
  isPublished?: boolean;
}, Workflow> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  const workflow = await context.entities.Workflow.findFirst({
    where: { id: args.id, userId: context.user.id },
  });

  if (!workflow) {
    throw new HttpError(404, 'Workflow not found');
  }

  return context.entities.Workflow.update({
    where: { id: args.id },
    data: {
      ...(args.name && { name: args.name }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.nodes && { nodes: args.nodes }),
      ...(args.edges && { edges: args.edges }),
      ...(args.isPublished !== undefined && { isPublished: args.isPublished }),
      version: workflow.version + 1,
    },
  });
};

export const deleteWorkflow: DeleteWorkflow<{ id: string }, Workflow> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  const workflow = await context.entities.Workflow.findFirst({
    where: { id: args.id, userId: context.user.id },
  });

  if (!workflow) {
    throw new HttpError(404, 'Workflow not found');
  }

  return context.entities.Workflow.delete({
    where: { id: args.id },
  });
};

export const getUserWorkflows: GetUserWorkflows<void, Workflow[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  return context.entities.Workflow.findMany({
    where: { userId: context.user.id },
    orderBy: { updatedAt: 'desc' },
  });
};

export const getWorkflowById: GetWorkflowById<{ id: string }, Workflow> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  const workflow = await context.entities.Workflow.findFirst({
    where: { id: args.id, userId: context.user.id },
  });

  if (!workflow) {
    throw new HttpError(404, 'Workflow not found');
  }

  return workflow;
}; 