import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
type BudgetAlertData = {
  percentageUsed: number;
  budgetAmount: number;
  totalExpenses: number;
};

type MonthlyReportData = {
  month: string;
  stats: {
    totalIncome: number;
    totalExpenses: number;
    byCategory?: Record<string, number>;
  };
  insights?: string[];
};

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  /** -------------------------------
   *  MONTHLY REPORT TEMPLATE
   * --------------------------------
   */
  //   if (type === "monthly-report") {
  //     const month = data?.month ?? "";
  //     const stats = data?.stats ?? {};
  //     const insights = data?.insights ?? [];

  //     return (
  //       <Html>
  //         <Head />
  //         <Preview>Your Monthly Financial Report</Preview>
  //         <Body style={styles.body}>
  //           <Container style={styles.container}>
  //             <Heading style={styles.title}>Monthly Financial Report</Heading>

  //             <Text style={styles.text}>Hello {userName},</Text>
  //             <Text style={styles.text}>
  //               Here’s your financial summary for {month}:
  //             </Text>

  //             {/* Main Stats */}
  //             <Section style={styles.statsContainer}>
  //               <div style={styles.stat}>
  //                 <Text style={styles.text}>Total Income</Text>
  //                 <Text style={styles.heading}>${stats.totalIncome ?? 0}</Text>
  //               </div>

  //               <div style={styles.stat}>
  //                 <Text style={styles.text}>Total Expenses</Text>
  //                 <Text style={styles.heading}>${stats.totalExpenses ?? 0}</Text>
  //               </div>

  //               <div style={styles.stat}>
  //                 <Text style={styles.text}>Net</Text>
  //                 <Text style={styles.heading}>
  //                   ${(stats.totalIncome ?? 0) - (stats.totalExpenses ?? 0)}
  //                 </Text>
  //               </div>
  //             </Section>

  //             {/* Category Breakdown */}
  //             {stats?.byCategory && (
  //               <Section style={styles.section}>
  //                 <Heading style={styles.heading}>Expenses by Category</Heading>

  //                 {Object.entries(stats.byCategory).map(([cat, amount]) => (
  //                   <div key={cat} style={styles.row}>
  //                     <Text style={styles.text}>{cat}</Text>
  //                     <Text style={styles.text}>${amount}</Text>
  //                   </div>
  //                 ))}
  //               </Section>
  //             )}

  //             {/* Insights */}
  //             {insights?.length > 0 && (
  //               <Section style={styles.section}>
  //                 <Heading style={styles.heading}>Welth Insights</Heading>
  //                 {insights.map((insight, i) => (
  //                   <Text key={i} style={styles.text}>
  //                     • {insight}
  //                   </Text>
  //                 ))}
  //               </Section>
  //             )}

  //             <Text style={styles.footer}>
  //               Thank you for using Welth. Stay consistent to improve your
  //               financial health!
  //             </Text>
  //           </Container>
  //         </Body>
  //       </Html>
  //     );
  //   }

  /** -------------------------------
   *  BUDGET ALERT TEMPLATE
   * --------------------------------
   */
  if (type === "budget-alert") {
    const d = data as BudgetAlertData;

    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You’ve used {Number(d.percentageUsed).toFixed(1)}% of your monthly
              budget.
            </Text>

            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.heading}>${d.budgetAmount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.heading}>${d.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.heading}>
                  ${d.budgetAmount - d.totalExpenses}
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  /** fallback */
  return null;
}

/* ------------------------
   GLOBAL EMAIL STYLES
------------------------ */
const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    maxWidth: "580px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: 600,
    margin: "0 0 12px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "0 0 12px",
  },
  section: {
    marginTop: "28px",
    padding: "18px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "24px 0",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center" as const,
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};
