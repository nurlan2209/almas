import './About.css';
import CTA from '../../components/CTA/CTA'; 

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">Біз туралы</h1>
          <p className="about-subtitle">Біздің миссиямыз бен құндылықтарымыз туралы көбірек біліңіз</p>
        </div>
      </section>
      
      <section className="about-mission">
        <div className="container">
          <div className="about-mission-content">
            <div className="mission-text">
              <h2>Біздің миссия</h2>
              <p>
                «ӨмірДонор» жобасының миссиясы — Қазақстанда ерікті қан донорлығы мәдениетін дамыту. 
                Біз әрбір қан құюға мұқтаж адам уақытында қажетті көмек ала алатындай етіп жұмыс істейміз.
              </p>
              <p>
                Біздің команда қан донорлығының маңыздылығы туралы қоғамның хабардарлығын арттыруға, донорлар үшін қолайлы жағдайлар жасауға және донорлар мен медициналық мекемелер арасында тиімді өзара іс-қимыл жүйесін құруға ұмтылады.
              </p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder"></div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-values">
        <div className="container">
          <h2 className="values-title">Біздің құндылықтар</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Өмір</h3>
              <p>Біз әрбір адам өмірін бағалаймыз және қан донорлығына мұқтаж жандарға көмектесу үшін бар күшімізді саламыз.</p>
            </div>
            <div className="value-card">
              <h3>Еріктілік</h3>
              <p>Біз басқа адамдарға көмектесу ниетіне негізделген ерікті, тегін донорлық принципін қолдаймыз.</p>
            </div>
            <div className="value-card">
              <h3>Жауапкершілік</h3>
              <p>Біз донация процесін ұйымдастыруға және донорлар мен реципиенттердің қауіпсіздігін қамтамасыз етуге жауапкершілікпен қараймыз.</p>
            </div>
            <div className="value-card">
              <h3>Ақпараттылық</h3>
              <p>Біз қан донорлығы туралы сенімді ақпаратты таратудың маңыздылығына сенеміз, бұл саналы шешімдер қабылдауға мүмкіндік береді.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-history">
        <div className="container">
          <h2>Жобаның тарихы</h2>
          <div className="history-timeline">
            <div className="timeline-item">
              <div className="timeline-date">2020</div>
              <div className="timeline-content">
                <h3>Жобаның құрылуы</h3>
                <p>«ӨмірДонор» жобасы Қазақстанда қан донорлығы жүйесін дамытудың маңыздылығын түсінген энтузиастар тобымен құрылды.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2021</div>
              <div className="timeline-content">
                <h3>Алғашқы науқан</h3>
                <p>Біз Қазақстанның 10-нан астам қаласын қамтыған алғашқы ауқымды донорларды тарту науқанын өткіздік.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2022</div>
              <div className="timeline-content">
                <h3>Орталықтар желісін дамыту</h3>
                <p>Аймақтық қан орталықтарымен ынтымақтастық басталып, бірыңғай ақпараттық желі құрылды.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2024</div>
              <div className="timeline-content">
                <h3>Білім беру бағдарламасы</h3>
                <p>Мектептер мен жоғары оқу орындарына арналған қан донорлығының маңыздылығы туралы білім беру бағдарламасы іске қосылды.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-team">
        <div className="container">
          <h2>Біздің команда</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Нұрлан Жұмаев</h3>
              <p className="member-role">Жоба құрушысы</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Айгүл Сейітова</h3>
              <p className="member-role">Медициналық үйлестіруші</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Ербол Қасымов</h3>
              <p className="member-role">Еріктілер жетекшісі</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Динара Омарова</h3>
              <p className="member-role">PR маманы</p>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
};

export default About;