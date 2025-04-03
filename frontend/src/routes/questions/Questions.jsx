import Button from "../../components/button/Button";
import Pagination from "../../components/pagination/Pagination";
import QuestionList from "../../components/question-list/QuestionList";
import { questionList } from "../../samples/questions";
import styles from "./Questions.module.css";
const Questions = () => {
  return (
    <main className={styles.questions}>
      <section className={styles["top-header"]}>
        <h1>Questions & Answers</h1>
        <Button text={"Ask a Question"} onClick={() => {}} />
      </section>
      <section className={styles.filters}>
        <h3 className={styles.title}>Filter Questions</h3>
        <div className={styles.options}>
          <label>
            Faith Tradition
            <select className={styles.select}>
              <option value="">All Traditions</option>
              <option value="buddhism">Buddhism</option>
              <option value="christianity">Christianity</option>
              <option value="hinduism">Hinduism</option>
              <option value="islam">Islam</option>
              <option value="judaism">Judaism</option>
              <option value="sikhism">Sikhism</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Status
            <select className={styles.select}>
              <option value="">All Questions</option>
              <option value="answered">Answered</option>
              <option value="pending">Awaiting Answer</option>
            </select>
          </label>

          <label>
            Sort By
            <select className={styles.select}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_votes">Most Votes</option>
              <option value="most_answers">Most Answers</option>
            </select>
          </label>
        </div>

        <div className={styles.tags}>
          <div className={styles.tag}>
            Buddhism <span className={styles.remove}>×</span>
          </div>
        </div>
      </section>
      <QuestionList questionList={questionList} />
      <Pagination currentPage={1} pages={questionList.length} />
    </main>
  );
};

export default Questions;
