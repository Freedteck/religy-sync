import { useState } from "react";
import Answers from "../../components/answers/Answers";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Question from "../../components/question/Question";
import RelatedQuestions from "../../components/related-questions/RelatedQuestions";
import YourAnswer from "../../components/your-answer/YourAnswer";
import styles from "./QuestionDetails.module.css";

const QuestionDetails = () => {
  const question = {
    id: "q123",
    title: "What is the difference between Theravada and Mahayana Buddhism?",
    status: "Answered",
    statusClass: "status-answered",
    details: (
      <>
        <p>
          I understand that these are two major schools of Buddhism, but I'm not
          clear on their main differences in terms of teachings, practices, and
          historical development. Could someone explain the key distinctions
          between these traditions?
        </p>
        <p>I'm especially interested in understanding:</p>
        <ul>
          <li>Core philosophical differences</li>
          <li>Different approaches to enlightenment</li>
          <li>Historical origins and geographic spread</li>
          <li>Major texts and authoritative sources</li>
        </ul>
        <p>Any scholarly insights would be greatly appreciated. Thank you!</p>
      </>
    ),
    tags: ["Buddhism", "Theravada", "Mahayana", "Comparative Religion"],
    votes: 42,
    answers: 3,
    views: 876,
    askedBy: "DharmaSeekerX",
    askedByInitials: "D",
    askedAt: "2 days ago • 08:45 AM",
  };

  const answers = [
    {
      id: "a1",
      content: (
        <>
          <p>
            Theravada and Mahayana Buddhism represent two major branches of
            Buddhist thought that diverged over centuries of development. Here
            are the key differences:
          </p>

          <p>
            <strong>Historical Development:</strong>
          </p>
          <ul>
            <li>
              Theravada (Way of the Elders): Claims to preserve the original
              teachings of the Buddha. Emerged from the Sthaviravada school
              following the Second Buddhist Council (4th century BCE).
            </li>
            <li>
              Mahayana (Great Vehicle): Emerged around the 1st century CE,
              representing a more adaptive and expansive interpretation of
              Buddha's teachings.
            </li>
          </ul>

          <p>
            <strong>Core Philosophical Differences:</strong>
          </p>
          <ul>
            <li>
              Theravada emphasizes individual enlightenment through one's own
              efforts. The goal is to become an arhat (worthy one) who has
              attained nirvana.
            </li>
            <li>
              Mahayana emphasizes the bodhisattva ideal - attaining
              enlightenment not just for oneself but delaying final nirvana to
              help all sentient beings achieve liberation.
            </li>
          </ul>

          <p>
            <strong>Scripture and Authority:</strong>
          </p>
          <ul>
            <li>
              Theravada primarily follows the Pali Canon (Tipitaka), believed to
              contain the earliest recorded teachings of the Buddha.
            </li>
            <li>
              Mahayana incorporates the Pali texts but adds numerous additional
              sutras that Theravadins don't recognize as authentic Buddha
              teachings, like the Lotus Sutra, Heart Sutra, and Diamond Sutra.
            </li>
          </ul>

          <p>
            <strong>Geographic Distribution:</strong>
          </p>
          <ul>
            <li>
              Theravada is dominant in Sri Lanka, Thailand, Myanmar, Cambodia,
              and Laos.
            </li>
            <li>
              Mahayana spread throughout East Asia, including China, Japan,
              Korea, and Vietnam.
            </li>
          </ul>

          <p>
            <strong>Buddha Concept:</strong>
          </p>
          <ul>
            <li>
              Theravada views the Buddha as a supremely enlightened human
              teacher.
            </li>
            <li>
              Mahayana developed the concept of the trikaya (three bodies of
              Buddha), viewing the Buddha as having transcendental aspects
              beyond his historical manifestation.
            </li>
          </ul>

          <p>
            Despite these differences, both traditions share fundamental
            elements like the Four Noble Truths, the Eightfold Path, and core
            ethical precepts. Modern scholarship has increasingly recognized
            that the divisions aren't always clear-cut, and many practitioners
            incorporate elements from both traditions.
          </p>
        </>
      ),
      scholarInitials: "VS",
      scholarName: "Venerable Sumedho",
      scholarTitle: "Buddhist Scholar • Theravada Tradition",
      helpfulCount: 36,
      answeredAt: "Answered 1 day ago",
    },
    {
      id: "a2",
      content: (
        <>
          <p>
            To build on what Venerable Sumedho has explained, I'd like to add
            some details about the practical and meditative differences between
            these traditions:
          </p>

          <p>
            <strong>Meditation Practices:</strong>
          </p>
          <ul>
            <li>
              Theravada emphasizes Vipassana (insight) and Samatha
              (concentration) meditation, with a focus on observing the three
              marks of existence: impermanence, suffering, and non-self.
            </li>
            <li>
              Mahayana incorporates these practices but also includes
              visualization techniques, mantra recitation, and other methods
              developed in various schools like Chan/Zen (meditation-focused)
              and Pure Land (devotion-focused).
            </li>
          </ul>

          <p>
            <strong>Understanding of Emptiness (Sunyata):</strong>
          </p>
          <ul>
            <li>
              Theravada addresses emptiness primarily through the concept of
              anatta (non-self).
            </li>
            <li>
              Mahayana, particularly in the Madhyamaka philosophical school,
              developed elaborate theories of emptiness extending beyond just
              personal identity to all phenomena.
            </li>
          </ul>

          <p>
            <strong>Philosophical Schools:</strong>
          </p>
          <ul>
            <li>
              Theravada's philosophical development is primarily represented by
              the Abhidhamma and commentaries.
            </li>
            <li>
              Mahayana gave rise to diverse philosophical schools including
              Madhyamaka, Yogacara, Tiantai, and Huayan, each with distinct
              interpretations of Buddha's teachings.
            </li>
          </ul>

          <p>
            Both traditions offer profound paths to awakening, but they
            emphasize different aspects and approaches to the journey. Neither
            is inherently "better" - they simply address different spiritual
            temperaments and cultural contexts.
          </p>
        </>
      ),
      scholarInitials: "DL",
      scholarName: "Dr. Lin",
      scholarTitle: "Buddhist Studies Professor • Comparative Religion",
      helpfulCount: 22,
      answeredAt: "Answered 16 hours ago",
    },
  ];

  const relatedQuestions = [
    {
      id: "q1",
      title: "What are the key differences between Zen and Tibetan Buddhism?",
      answers: 15,
      views: 476,
    },
    {
      id: "q2",
      title:
        "How does the concept of rebirth differ between Hindu and Buddhist traditions?",
      answers: 8,
      views: 312,
    },
    {
      id: "q3",
      title:
        "What is the significance of the Lotus Sutra in Mahayana Buddhism?",
      answers: 6,
      views: 189,
    },
    {
      id: "q4",
      title: "How do Buddhist traditions approach meditation differently?",
      answers: 12,
      views: 527,
    },
  ];

  const [sortOrder, setSortOrder] = useState("votes");
  const [answerText, setAnswerText] = useState("");

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswerText(e.target.value);
  };

  const handleSubmitAnswer = () => {
    // Logic to submit answer to backend
    console.log("Submitting answer:", answerText);
    setAnswerText("");
  };

  return (
    <main className={styles["question-details"]}>
      <Breadcrumb />
      <Question question={question} />
      <Answers
        answers={answers}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
      />
      <YourAnswer handleSubmitAnswer={handleSubmitAnswer} />
      <RelatedQuestions relatedQuestions={relatedQuestions} />
    </main>
  );
};

export default QuestionDetails;
