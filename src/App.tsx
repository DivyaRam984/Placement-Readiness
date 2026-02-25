import '@/design-system/index.css';
import { AppLayout } from '@/components';
import { Card } from '@/components';

export function App() {
  return (
    <AppLayout
      projectName="Job Readiness App"
      step={1}
      totalSteps={5}
      status="In Progress"
      headline="Design system"
      subtext="Establish a consistent visual and structural foundation for the product."
      stepExplanation="This step defines colors, typography, spacing, and the global layout. No product features are added yet."
      promptContent="Use the KodNest Premium Build System. Colors: bg #F7F6F3, text #111111, accent #8B0000. Serif headings, sans body. Spacing: 8, 16, 24, 40, 64px."
      workspaceChildren={
        <Card>
          <h2 style={{ marginBottom: '16px' }}>Primary workspace</h2>
          <p style={{ maxWidth: '720px' }}>
            The main product interaction happens here. Use clean cards and predictable components. This shell demonstrates the layout only.
          </p>
        </Card>
      }
      proofItems={[
        { id: 'ui', label: 'UI Built', checked: false },
        { id: 'logic', label: 'Logic Working', checked: false },
        { id: 'test', label: 'Test Passed', checked: false },
        { id: 'deployed', label: 'Deployed', checked: false },
      ]}
    />
  );
}
