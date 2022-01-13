using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Support.UI;
using System.Threading;
using System.Runtime.InteropServices;

namespace rouletteBet
{
    // 243
    public partial class Form1 : Form
    {
        public string region;
        //hawk35:741852Akl+
        public Form1(string regionParam)
        {
            InitializeComponent();
            firefox = new FirefoxDriver(firefoxservice, new FirefoxOptions());
            firefox.Navigate().GoToUrl(/*regionParam == "Other" ? "http://click.casoo.partners/afs/come.php?cid=7135&ctgid=100&atype=1&brandid=3" :
                regionParam == "Europe" ? "https://www.casino4u.io" :
                regionParam == "Asia" ? "https://www.gioocasino.com" :
                ""*//*"https://www.marsbet6.com/en/live-casino?game_player=7592&gv_type=r"*/  /*"https://www.casino4u.io"*/  "https://www.gioocasino.com/game/crazy-time");
            label3.Text = "Hawk Roulette Bot | Region: " + regionParam;
            region = regionParam;
        }

        public string kullanici;


        int totalRoundCounter = 0;
        int roundLimiter = 0;
         private void Form1_Load(object sender, EventArgs e)
        {


            firefoxservice.HideCommandPromptWindow = true;


        }

        static FirefoxDriverService firefoxservice = FirefoxDriverService.CreateDefaultService();
        static FirefoxDriver firefox;

        private void clicker(int num)
        {

            try
            {
                firefox.SwitchTo().Window(firefox.WindowHandles.Last());
                var DBViFrame = firefox.FindElement(By.TagName("iframe"));
                firefox.SwitchTo().Frame(DBViFrame);
                var dataEntryButton = firefox.FindElement(By.XPath("//*[@class=\"classicStandard-wrapper\"]/*[@data-bet-spot-id=\"" + num + "\"]"));
                dataEntryButton.Click();
            }
            catch (Exception)
            {
                predicts.Remove(num);
                int yeniNo = _random.Next(1, 37);
                clicker(yeniNo);
                predicts.Add(yeniNo);
            }


        }
        private readonly Random _random = new Random();
        private void numberGenerator()
        {
            generatedNumber = _random.Next(18, 24);
        }
        int generatedNumber;
        int counter = 1;
        int roundCounter = 1;
        List<int> predicts = new List<int>();
        private void predicter()
        {



            for (int i = 0; i < generatedNumber; i++)
            {
                int predictedNumber = _random.Next(1, 37);
                predicts.Add(predictedNumber);
            }

          //  Console.WriteLine("Liste Uzunluğu : " + generatedNumber);
          //  Console.WriteLine("/////////////////////////////////\n");
            foreach (var item in predicts)
            {
                Console.WriteLine(counter + ". " + item);
                counter++;
            }
          //  Console.WriteLine("/////////////////////////////////");
            counter = 1;
        }

        private void better()
        {
            if (roundCounter <= 3)
            {
                if (predicts.Contains(luckyNumber()) == false && roundCounter != 1)
                {
                    predicts.Clear();
                    numberGenerator();
                    predicter();
                    foreach (var item in predicts.ToList())
                    {
                        clicker(item);
                    }
                    Thread.Sleep(200);
                    doubleOrNothing();
                }
                else
                {
                    predicts.Clear();
                    numberGenerator();
                    predicter();
                    foreach (var item in predicts.ToList())
                    {
                        clicker(item);
                    }
                }
            }
            else if (roundCounter == 5)
            {
                roundCounter = 0;
            }
            roundCounter++;
            totalRoundCounter++;
            rounder();
        //    Console.WriteLine("totalRoundCounter = " + totalRoundCounter);
        }

        private void rounder()
        {
            if (roundLimiter != 0)
            {
                label5.Visible = true;
                label5.Text = Convert.ToString(roundLimiter - totalRoundCounter);
                guna2TrackBar2.Value = roundLimiter - totalRoundCounter;
            }
        }



        bool betable = true;
        private void checker()
        {

            try
            {
                firefox.SwitchTo().Window(firefox.WindowHandles.Last());
                //string iframe = this.textBox5.Text;
                var DBViFrame = firefox.FindElement(By.XPath("//iframe[@id=\"game-block\"]"));
                firefox.SwitchTo().Frame(DBViFrame);
                //iframe = this.textBox6.Text;
                try
                {
                    DBViFrame = firefox.FindElement(By.XPath("//*[contains(@id, \"_iframe\")]/iframe"));
                    firefox.SwitchTo().Frame(DBViFrame);
                }
                catch (Exception) { }
                WebDriverWait wait = new WebDriverWait(firefox, TimeSpan.FromSeconds(3));
                // var dataEntryButton = wait.Until(e => e.FindElement(By.XPath("/html/body/div[4]/div/div/div/div[2]/div/div[6]/div[1]/div/div")));
                //var dataEntryButton = firefox.FindElement(By.XPath("/html/body/div[4]/div/div/div/div[2]/div/div[6]/div[1]/div/div"));
                //string classChecker = dataEntryButton.GetAttribute("class");

                //string xpath = this.textBox4.Text.ToString().Replace("_", "-").Replace("\\", "");
                //    //*[contains(@class, "text--27a51")]
                var dataEntryButton = firefox.FindElement(By.XPath("//*[contains(@class, \"box--\")]/*[contains(@class,\"status--\")]"));
                string classChecker = dataEntryButton.GetAttribute("class"); // .text

                //BAHİS BASILABİLİR
                if (classChecker.Contains("green") && classChecker.Contains("landscape"))// ESKİ KOD(ÇALIŞMIYOR): "status--ibRSv green--3odx9 landscape--NHZOX animate--I1-ic desktop-theme--fmEBL"
                {
                    if (betable == true)
                    {
                        if (totalRoundCounter < roundLimiter || roundLimiter == 0)
                        {

                            better();

                            Console.WriteLine("****Bahis Girildi****");
                            betable = false;
                        }
                        else
                        {
                            timer2.Stop();
                            timer1.Stop();

                            baslaButton.Text = "START";
                            totalRoundCounter = 0;
                            roundLimiter = 0;
                            basla = true;
                        }
                    }
                    else
                    {
                        Console.WriteLine("Bahisler Açık Bahis Girilmedi");
                    }

                }
                //BAHİS BASILAMAZ
                else if (classChecker.Contains("red") && classChecker.Contains("landscape")) // ESKİ KOD(ÇALIŞMIYOR): "status--ibRSv red--G7i1l landscape--NHZOX animate--I1-ic desktop-theme--fmEBL"
                {
                    betable = true;
                    Console.WriteLine("Bahisler Kapalı");
                }
            }
            catch (Exception err)
            {
                MessageBox.Show(err.Message);
            }
            //div[contains(@class, 'Test')]
            

        }
        private void timer1_Tick(object sender, EventArgs e)
        {
            
            timer2.Start();
            checker();

      

        }



        private int luckyNumber()
        {
            try
            {
                firefox.SwitchTo().Window(firefox.WindowHandles.Last());
                var DBViFrame = firefox.FindElement(By.TagName("iframe"));
                firefox.SwitchTo().Frame(DBViFrame);
                var dataEntryButton = firefox.FindElement(By.XPath("//*[@class=\"value--877c6\"][1]"));
                string classChecker = dataEntryButton.GetAttribute("text");
                //Console.WriteLine(Convert.ToInt32(classChecker.Split(new string[] { ">" }, StringSplitOptions.None)[1].Split('<')[0].Trim()));
                //return Convert.ToInt32(classChecker.Split(new string[] { ">" }, StringSplitOptions.None)[1].Split('<')[0].Trim());
                return Convert.ToInt32(classChecker);
            }
            catch (Exception)
            {

            }
            return 0;
        }
        public void doubleOrNothing()
        {
            firefox.SwitchTo().Window(firefox.WindowHandles.Last());
            var DBViFrame = firefox.FindElement(By.TagName("iframe"));
            firefox.SwitchTo().Frame(DBViFrame);
            var dataEntryButton = firefox.FindElement(By.XPath("//*[@data-role=\"double-button\"]"));
            dataEntryButton.Click();
        }

        private void kayanYazi()
        {
            button3.Text = _random.Next(0, 37).ToString();
            button50.Text = _random.Next(0, 37).ToString();
            button73.Text = _random.Next(0, 37).ToString();
            button70.Text = _random.Next(0, 37).ToString();
            button67.Text = _random.Next(0, 37).ToString();
            button64.Text = _random.Next(0, 37).ToString();
            button61.Text = _random.Next(0, 37).ToString();
            button58.Text = _random.Next(0, 37).ToString();
            button55.Text = _random.Next(0, 37).ToString();
            button52.Text = _random.Next(0, 37).ToString();
            button48.Text = _random.Next(0, 37).ToString();
            button45.Text = _random.Next(0, 37).ToString();
            button42.Text = _random.Next(0, 37).ToString();
            button4.Text = _random.Next(0, 37).ToString();
        }

        bool basla = true;
        private void baslaButton_Click(object sender, EventArgs e)
        {
            string currentUrl = firefox.Url;
           
                switch (basla)
                {
                    case true:
                        timer1.Start();
                        timer2.Start();
                        basla = false;
                        baslaButton.Text = "STOP";
                        break;
                    case false:
                        timer1.Stop();
                        timer2.Stop();
                        basla = true;
                        baslaButton.Text = "START";
                        break;

                }
            if (currentUrl.Contains("casoo")) {
            }
            else
            {
                /*
                uyariEkrani uyariEkrani = new uyariEkrani();
                uyariEkrani.Show();
                */
            }

        }

        private void button41_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
        }

        private void button40_Click(object sender, EventArgs e)
        {


            Application.Exit();


        }
        [DllImport("user32.DLL", EntryPoint = "ReleaseCapture")]
        private extern static void ReleaseCapture();
        [DllImport("user32.DLL", EntryPoint = "SendMessage")]
        private extern static void SendMessage(System.IntPtr one, int two, int three, int four);
        private void panel3_MouseDown(object sender, MouseEventArgs e)
        {
            ReleaseCapture();
            SendMessage(Handle, 0x112, 0xf012, 0);
        }


        private void timer2_Tick(object sender, EventArgs e)
        {
            kayanYazi();
        }

        private void guna2TrackBar3_Scroll(object sender, ScrollEventArgs e)
        {
            label4.Text = guna2TrackBar3.Value.ToString();
            switch (guna2TrackBar3.Value)
            {
                case 1:
                    roundLimiter = 6;
                    guna2TrackBar2.Maximum = 6;
                    guna2TrackBar2.Value = 6;
                    totalRoundCounter = 0;
                    roundCounter = 1;
                    label4.Text = label5.Text = "6";
                    label5.Visible = true;
                    break;
                case 2:
                    roundLimiter = 12;
                    guna2TrackBar2.Maximum = 12;
                    guna2TrackBar2.Value = 12;
                    totalRoundCounter = 0;
                    roundCounter = 1;
                    label4.Text = label5.Text = "12";
                    label5.Visible = true;
                    break;
                case 3:
                    roundLimiter = 15;
                    guna2TrackBar2.Maximum = 15;
                    guna2TrackBar2.Value = 15;
                    totalRoundCounter = 0;
                    roundCounter = 1;
                    label4.Text = label5.Text = "15";
                    label5.Visible = true;
                    break;
                case 0:
                    roundLimiter = 0;
                    guna2TrackBar2.Maximum = 1;
                    guna2TrackBar2.Value = 1;
                    label4.Text = "Unlimited";
                    label5.Visible = false;
                    break;

            }
            totalRoundCounter = 0;
        }

        private void guna2TrackBar1_Scroll(object sender, ScrollEventArgs e)
        {

            textBox1.Text = guna2TrackBar1.Value.ToString();
        }

        private void guna2TrackBar4_Scroll(object sender, ScrollEventArgs e)
        {
            textBox2.Text = guna2TrackBar4.Value.ToString();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            textBox3.Text = 0.ToString();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            textBox3.Text = 1.ToString();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            textBox3.Text = 2.ToString();
        }

        private void button10_Click(object sender, EventArgs e)
        {
            textBox3.Text = 3.ToString();
        }

        private void button8_Click(object sender, EventArgs e)
        {
            textBox3.Text = 4.ToString();
        }

        private void button7_Click(object sender, EventArgs e)
        {
            textBox3.Text = 5.ToString();
        }

        private void button6_Click(object sender, EventArgs e)
        {
            textBox3.Text = 6.ToString();
        }

        private void button15_Click(object sender, EventArgs e)
        {
            textBox3.Text = 7.ToString();
        }

        private void button14_Click(object sender, EventArgs e)
        {
            textBox3.Text = 8.ToString();
        }

        private void button13_Click(object sender, EventArgs e)
        {
            textBox3.Text = 9.ToString();
        }

        private void button12_Click(object sender, EventArgs e)
        {
            textBox3.Text = 10.ToString();
        }

        private void button11_Click(object sender, EventArgs e)
        {
            textBox3.Text = 11.ToString();
        }

        private void button9_Click(object sender, EventArgs e)
        {
            textBox3.Text = 12.ToString();
        }

        private void button21_Click(object sender, EventArgs e)
        {
            textBox3.Text = 13.ToString();
        }

        private void button20_Click(object sender, EventArgs e)
        {
            textBox3.Text = 14.ToString();
        }

        private void button19_Click(object sender, EventArgs e)
        {
            textBox3.Text = 15.ToString();
        }

        private void button18_Click(object sender, EventArgs e)
        {
            textBox3.Text = 16.ToString();
        }

        private void button17_Click(object sender, EventArgs e)
        {
            textBox3.Text = 17.ToString();
        }

        private void button16_Click(object sender, EventArgs e)
        {
            textBox3.Text = 18.ToString();
        }

        private void button27_Click(object sender, EventArgs e)
        {
            textBox3.Text = 19.ToString();
        }

        private void button26_Click(object sender, EventArgs e)
        {
            textBox3.Text = 20.ToString();
        }

        private void button25_Click(object sender, EventArgs e)
        {
            textBox3.Text = 21.ToString();
        }

        private void button24_Click(object sender, EventArgs e)
        {
            textBox3.Text = 22.ToString();
        }

        private void button23_Click(object sender, EventArgs e)
        {
            textBox3.Text = 23.ToString();
        }

        private void button22_Click(object sender, EventArgs e)
        {
            textBox3.Text = 24.ToString();
        }

        private void button39_Click(object sender, EventArgs e)
        {
            textBox3.Text = 25.ToString();
        }

        private void button38_Click(object sender, EventArgs e)
        {
            textBox3.Text = 26.ToString();
        }

        private void button37_Click(object sender, EventArgs e)
        {
            textBox3.Text = 27.ToString();
        }

        private void button36_Click(object sender, EventArgs e)
        {
            textBox3.Text = 28.ToString();
        }

        private void button35_Click(object sender, EventArgs e)
        {
            textBox3.Text = 29.ToString();
        }

        private void button34_Click(object sender, EventArgs e)
        {
            textBox3.Text = 30.ToString();
        }

        private void button33_Click(object sender, EventArgs e)
        {
            textBox3.Text = 31.ToString();
        }

        private void button32_Click(object sender, EventArgs e)
        {
            textBox3.Text = 32.ToString();
        }

        private void button31_Click(object sender, EventArgs e)
        {
            textBox3.Text = 33.ToString();
        }

        private void button30_Click(object sender, EventArgs e)
        {
            textBox3.Text = 34.ToString();
        }

        private void button29_Click(object sender, EventArgs e)
        {
            textBox3.Text = 35.ToString();
        }

        private void button28_Click(object sender, EventArgs e)
        {
            textBox3.Text = 36.ToString();
        }
    }
    public static class StringSt
    {
        public static string Slice(string text, int from, int to)
        {
            string outStr = "";
            for (int i = from; i < to && text.Length > i; i++){outStr += text[i];}
            return outStr;
        }
    }
}
