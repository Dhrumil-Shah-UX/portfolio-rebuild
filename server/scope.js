// Conservative deterministic screening, not a separate model/moderation request.
// Matching is deliberately phrase-based: mentioning "AI" alone is not permission
// to ask arbitrary trivia, generate code, or override the assistant's role.
const injectionPatterns = [
  /\b(?:ignore|disregard|override|forget|bypass)\b[\s\S]{0,100}\b(?:previous|prior|above|system|developer|instructions?|rules?|guardrails?)\b/i,
  /\b(?:reveal|show|print|repeat|return|expose|display|give|tell|dump|what|share|quote|summarize|read)\b[\s\S]{0,100}\b(?:system\s*(?:prompt|message|instructions?)|developer\s*(?:prompt|message|instructions?)|api[ _-]?keys?|secrets?|credentials?|passwords?|environment variables?|process\.env|config(?:uration)?)\b/i,
  /\b(?:act|behave|become|pretend|switch)\b[\s\S]{0,60}\b(?:general[- ]purpose|unrestricted|unfiltered|jailbroken|chatgpt|dan)\b/i,
  /\b(?:you are|from now on|respond as)\b[\s\S]{0,60}\b(?:general[- ]purpose|unrestricted|unfiltered|jailbroken|chatgpt)\b/i,
  /\b(?:fabricate|invent|make up|falsify|fake|pretend|claim)\b[\s\S]{0,100}\b(?:experience|evidence|skills?|metrics?|outcomes?|responsibilities|managed|years|worked|resume)\b/i,
  /(?:\[\s*system\s*\]|<\/?system>|<\|(?:system|im_start|start_header_id)\|>)/i
];
const project = /\b(?:trialbridge|virtual showroom|showroom|mindle|perspective|space shooter|ruhl|soor malhar|azhartt|ux diaries)\b/i;
const subject = /\b(?:dhrumil(?:['’]s)?|his|your|you|he)\b/i;
const portfolio = /\b(?:work|projects?|experience|skills?|process|workflow|resume|background|case stud(?:y|ies)|ownership|own(?:ed)?|role|design|ai|technical|healthcare|accessibility|career|education|team|job|fit|degree|salary|visa|sponsor|managed|leadership|know|tools?|use|used|build|built)\b/i;
const generalTask = /\b(?:weather|capital of|recipe|stock price|tell (?:me )?a joke|write (?:me )?(?:a poem|an essay|a story|code|a script)|solve (?:this|the)|translate (?:this|the)|what is (?:the|a|an)|how (?:do|can) i\b|explain (?:quantum|photosynthesis|machine learning))\b/i;
const directGeneralTask = /^(?:please\s+)?(?:write (?:me )?(?:a poem|an essay|a story|code|a script)|generate (?:code|a poem|a story)|tell (?:me )?a joke|translate\b|solve\b|explain (?:quantum|photosynthesis|machine learning))|\bcapital of\b/i;
function classify(question, history = [], jdMode = false) {
  if (injectionPatterns.some((pattern) => pattern.test(question))) return 'prompt_injection';
  if (directGeneralTask.test(question)) return 'off_topic';
  if (jdMode) return 'portfolio'; // A pasted JD is untrusted comparison data.
  if (generalTask.test(question) && !project.test(question) && !/\bdhrumil\b/i.test(question)) return 'off_topic';
  if (project.test(question) || (subject.test(question) && portfolio.test(question))) return 'portfolio';
  if (/^(?:healthcare(?: experience)?|ai (?:projects?|workflow)|technical (?:work|projects?)|accessibility experience|how i work|ownership|resume|background|skills|design process|match me to a job description)[?.!\s]*$/i.test(question)) return 'portfolio';
  if (/\b(?:portfolio|case stud(?:y|ies))\b/i.test(question) || (/\b(?:healthcare|ai|technical|accessibility)\b/i.test(question) && /\b(?:experience|projects?|workflow|work)\b/i.test(question))) return 'portfolio';
  if (history.length && /^(?:why|what (?:was|were|did|changed)|how (?:did|was)|tell me more|show more|and (?:why|how|what))\b/i.test(question) && question.length < 250 && !generalTask.test(question)) return 'portfolio';
  return 'off_topic';
}
module.exports = { classify };
