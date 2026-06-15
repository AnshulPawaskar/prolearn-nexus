// Mock course data with new module structure.
// Each module contains 3 stages: content (video|pdf) -> assessment -> coding.

export type AssessmentQuestion =
  | {
      id: string;
      type: 'mcq';
      question: string;
      options: string[];
      correct: number;
    }
  | {
      id: string;
      type: 'true_false';
      question: string;
      correct: boolean;
    }
  | {
      id: string;
      type: 'fill_blank';
      question: string;
      correct: string; // case-insensitive comparison
    }
  | {
      id: string;
      type: 'match';
      question: string;
      pairs: { left: string; right: string }[];
    };

export interface InVideoQuestion {
  // time in seconds when the video should pause and prompt
  atSeconds: number;
  question: string;
  options: string[];
  correct: number;
}

export interface VideoContent {
  kind: 'video';
  url: string; // direct video URL
  poster?: string;
  questions: InVideoQuestion[];
}

export interface PdfContent {
  kind: 'pdf';
  url: string; // direct PDF URL (embedded in iframe)
}

export interface CodingProblem {
  title: string;
  statement: string;
  starterCode: { python: string; c: string; java: string };
  // sample shown to learner
  sample: { input: string; expected: string };
  // hidden test cases used to grade
  tests: { input: string; expected: string }[];
}

export interface Module {
  id: string;
  title: string;
  content: VideoContent | PdfContent;
  assessment: AssessmentQuestion[];
  coding: CodingProblem;
}

export interface Course {
  id: string;
  title: string;
  modules: Module[];
}

export const mockCourses: Record<string, Course> = {
  '1': {
    id: '1',
    title: 'Cybersecurity for Professionals',
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Cybersecurity',
        content: {
          kind: 'video',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          questions: [
            {
              atSeconds: 15,
              question: 'Which of the following best describes Confidentiality?',
              options: [
                'Data is accurate and unaltered',
                'Data is accessible when needed',
                'Data is only seen by authorized users',
                'Data is encrypted in transit only',
              ],
              correct: 2,
            },
            {
              atSeconds: 40,
              question: 'Which is NOT a part of the CIA triad?',
              options: ['Confidentiality', 'Integrity', 'Authentication', 'Availability'],
              correct: 2,
            },
          ],
        },
        assessment: [
          {
            id: 'q1',
            type: 'mcq',
            question: 'What type of attack uses deceptive emails to steal credentials?',
            options: ['Phishing', 'DDoS', 'SQL Injection', 'Ransomware'],
            correct: 0,
          },
          {
            id: 'q2',
            type: 'true_false',
            question: 'A firewall is primarily a preventive control.',
            correct: true,
          },
          {
            id: 'q3',
            type: 'fill_blank',
            question: 'The “A” in the CIA triad stands for ______.',
            correct: 'availability',
          },
          {
            id: 'q4',
            type: 'match',
            question: 'Match the term with its definition.',
            pairs: [
              { left: 'Phishing', right: 'Deceptive emails' },
              { left: 'Firewall', right: 'Network traffic filter' },
              { left: 'Encryption', right: 'Scrambles data' },
            ],
          },
        ],
        coding: {
          title: 'Password Strength Checker',
          statement:
            'Read a string from stdin and print "STRONG" if it has length >= 8 and contains at least one digit, otherwise print "WEAK".',
          starterCode: {
            python: 'pwd = input().strip()\n# your code here\n',
            c: '#include <stdio.h>\n#include <string.h>\nint main(){\n  char s[256];\n  if(!fgets(s,sizeof(s),stdin)) return 0;\n  // your code here\n  return 0;\n}\n',
            java: 'import java.util.*;\npublic class Main{\n  public static void main(String[] a){\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n    // your code here\n  }\n}\n',
          },
          sample: { input: 'abc12345', expected: 'STRONG' },
          tests: [
            { input: 'abc12345', expected: 'STRONG' },
            { input: 'short1', expected: 'WEAK' },
            { input: 'noDigitsHere', expected: 'WEAK' },
            { input: 'longenough9', expected: 'STRONG' },
          ],
        },
      },
      {
        id: 'm2',
        title: 'Threat Landscape & Defense',
        content: {
          kind: 'pdf',
          url: 'https://www.africau.edu/images/default/sample.pdf',
        },
        assessment: [
          {
            id: 'q1',
            type: 'mcq',
            question: 'Which framework is widely used for cybersecurity risk management?',
            options: ['ITIL', 'NIST CSF', 'PRINCE2', 'COBIT'],
            correct: 1,
          },
          {
            id: 'q2',
            type: 'true_false',
            question: 'Patch management is a corrective control.',
            correct: true,
          },
          {
            id: 'q3',
            type: 'fill_blank',
            question: 'An ____ Persistent Threat is a long-term targeted attack.',
            correct: 'advanced',
          },
        ],
        coding: {
          title: 'Count Failed Logins',
          statement:
            'Read N on the first line, then N lines each "user status". Print the number of lines where status equals "FAIL".',
          starterCode: {
            python: 'n = int(input())\n# your code here\n',
            c: '#include <stdio.h>\n#include <string.h>\nint main(){\n  int n; scanf("%d",&n);\n  // your code here\n  return 0;\n}\n',
            java: 'import java.util.*;\npublic class Main{\n  public static void main(String[] a){\n    Scanner sc = new Scanner(System.in);\n    int n = Integer.parseInt(sc.nextLine().trim());\n    // your code here\n  }\n}\n',
          },
          sample: { input: '3\nalice OK\nbob FAIL\ncarol FAIL', expected: '2' },
          tests: [
            { input: '3\nalice OK\nbob FAIL\ncarol FAIL', expected: '2' },
            { input: '1\nx OK', expected: '0' },
            { input: '4\na FAIL\nb FAIL\nc FAIL\nd OK', expected: '3' },
          ],
        },
      },
    ],
  },
  '2': {
    id: '2',
    title: 'AI for Professionals',
    modules: [
      {
        id: 'm1',
        title: 'AI Foundations',
        content: {
          kind: 'video',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          questions: [
            {
              atSeconds: 20,
              question: 'Which is a supervised learning task?',
              options: ['Clustering', 'Classification', 'Dimensionality reduction', 'Anomaly detection'],
              correct: 1,
            },
          ],
        },
        assessment: [
          {
            id: 'q1',
            type: 'mcq',
            question: 'Gradient descent is used to:',
            options: ['Sort data', 'Minimize a loss function', 'Encrypt data', 'Augment data'],
            correct: 1,
          },
          {
            id: 'q2',
            type: 'fill_blank',
            question: 'In ML, overfitting means the model memorizes the ______ data.',
            correct: 'training',
          },
        ],
        coding: {
          title: 'Mean of Numbers',
          statement: 'Read N then N integers. Print their mean rounded to 2 decimals.',
          starterCode: {
            python: 'n = int(input())\nnums = list(map(int, input().split()))\n# your code here\n',
            c: '#include <stdio.h>\nint main(){\n  int n; scanf("%d",&n);\n  // your code here\n  return 0;\n}\n',
            java: 'import java.util.*;\npublic class Main{\n  public static void main(String[] a){\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // your code here\n  }\n}\n',
          },
          sample: { input: '3\n1 2 3', expected: '2.00' },
          tests: [
            { input: '3\n1 2 3', expected: '2.00' },
            { input: '4\n10 20 30 40', expected: '25.00' },
            { input: '2\n7 8', expected: '7.50' },
          ],
        },
      },
    ],
  },
};

export const getCourse = (id: string): Course => mockCourses[id] ?? mockCourses['1'];
