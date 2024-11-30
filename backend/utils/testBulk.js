// Mock sendEmail function

async function sendEmailMock(email, subject, content) {
    return new Promise((resolve) => setTimeout(resolve, Math.random() * 3000 + 100)); // Simulate delay
  }
  
  async function testConcurrency(concurrencyLevel) {
    const { default: PQueue } = await import('p-queue');
    console.log(`Testing with concurrency: ${concurrencyLevel}`);
  
    // Dynamically import PQueue
    const queue = new PQueue({ concurrency: concurrencyLevel });
  
    const totalTasks = 50000;
    console.log("total fake email gonna be sent:", totalTasks);
    const tasks = Array.from({ length: totalTasks }, (_, i) => ({
      email: `test${i}@example.com`,
      subject: `Test Email ${i}`,
      content: `This is a mock email for user ${i}`,
    }));
  
    const startTime = Date.now();
  
    for (const task of tasks) {
      queue.add(async () => {
        await sendEmailMock(task.email, task.subject, task.content);
      });
    }
  
    await queue.onIdle();
    console.log(
      `All tasks completed with concurrency ${concurrencyLevel} in ${
        (Date.now() - startTime) / 1000
      } seconds`
    );
  }
  
  // Test different concurrency levels
  (async () => {
    await testConcurrency(100); // Try higher concurrency
  })();
  