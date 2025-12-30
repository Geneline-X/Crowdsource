import type { ToolDefinition, ToolHandler } from "./types";

import {
  reportProblemTool,
  reportProblemHandler,
  upvoteProblemTool,
  upvoteProblemHandler,
  listTopProblemsTool,
  listTopProblemsHandler,
  getProblemDetailsTool,
  getProblemDetailsHandler,
  updateProblemLocationTool,
  updateProblemLocationHandler,
  getUserRecentProblemsTool,
  getUserRecentProblemsHandler,
  updateProblemDescriptionTool,
  updateProblemDescriptionHandler,
} from "./problems";

import {
  uploadImageTool,
  uploadImageHandler,
} from "./upload-image";

import {
  getProblemDetailsForVolunteerTool,
  getProblemDetailsForVolunteerHandler,
} from "./get-problem-for-volunteer";

import {
  submitResolutionProofTool,
  submitResolutionProofHandler,
} from "./submit-resolution-proof";

export type { ToolContext, ToolDefinition, ToolHandler } from "./types";

export const toolDefinitions: ToolDefinition[] = [
  reportProblemTool,
  upvoteProblemTool,
  listTopProblemsTool,
  getProblemDetailsTool,
  updateProblemLocationTool,
  getUserRecentProblemsTool,
  updateProblemDescriptionTool,
  uploadImageTool,
  getProblemDetailsForVolunteerTool,
  submitResolutionProofTool,
];

export const toolHandlers: Record<string, ToolHandler> = {
  report_problem: reportProblemHandler,
  upvote_problem: upvoteProblemHandler,
  list_top_problems: listTopProblemsHandler,
  get_problem_details: getProblemDetailsHandler,
  update_problem_location: updateProblemLocationHandler,
  get_user_recent_problems: getUserRecentProblemsHandler,
  update_problem_description: updateProblemDescriptionHandler,
  upload_image: uploadImageHandler,
  get_problem_details_for_volunteer: getProblemDetailsForVolunteerHandler,
  submit_resolution_proof: submitResolutionProofHandler,
};
