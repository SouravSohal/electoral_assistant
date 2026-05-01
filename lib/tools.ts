import { ELECTION_TIMELINE_STAGES, HOW_TO_VOTE_STEPS, NVSP_PORTAL, ECI_PORTAL, VOTER_HELPLINE } from "./constants";

/**
 * Tool: searchTimeline
 * Finds information about a specific stage in the election process.
 */
export async function searchTimeline({ query }: { query: string }) {
  const normalizedQuery = query.toLowerCase();
  const stage = ELECTION_TIMELINE_STAGES.find(
    (s) => 
      s.title.toLowerCase().includes(normalizedQuery) || 
      s.description.toLowerCase().includes(normalizedQuery) ||
      s.id.includes(normalizedQuery)
  );

  if (!stage) return { error: "No matching election stage found. Please ask about registration, polling, or counting." };

  return {
    title: stage.title,
    titleHi: stage.titleHi,
    description: stage.description,
    duration: stage.duration,
    keyDates: stage.keyDates,
    tips: stage.tips,
    officialLink: stage.officialLink
  };
}

/**
 * Tool: getVotingSteps
 * Provides step-by-step guide for voting in India.
 */
export async function getVotingSteps() {
  return HOW_TO_VOTE_STEPS.map(s => ({
    step: s.step,
    title: s.title,
    description: s.description
  }));
}

/**
 * Tool: getOfficialContacts
 * Provides ECI contact information and portals.
 */
export async function getOfficialContacts() {
  return {
    voterHelpline: VOTER_HELPLINE,
    nvspPortal: NVSP_PORTAL,
    eciPortal: ECI_PORTAL,
    description: "Official ECI resources for voter registration and election information."
  };
}

// Map tool names to actual functions for server-side execution
export const toolExecutors = {
  searchTimeline,
  getVotingSteps,
  getOfficialContacts
};

// Definitions for Gemini Tool Configuration
export const toolDefinitions: any = [
  {
    name: "searchTimeline",
    description: "Search for specific information about the 8 stages of the Indian election process (e.g., MCC, polling day, counting).",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The election stage or topic to search for (e.g., 'registration', 'EVM', 'results')."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "getVotingSteps",
    description: "Get the official step-by-step guide for voting in India, from registration to the polling booth.",
    parameters: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "getOfficialContacts",
    description: "Get the official Election Commission of India (ECI) portals and helpline numbers.",
    parameters: {
      type: "object",
      properties: {}
    }
  }
];
