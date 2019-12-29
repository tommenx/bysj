package util;

import model.FileModel;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.SAXException;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by tommenx on 2018/3/18.
 */
public class Util {
    /**
     * 对于文本文件来说，读取内容，存入Model中
     * @param filename
     * @param model
     * @throws IOException
     * @throws TikaException
     * @throws SAXException
     */
    public static void getText(String filename, FileModel model) throws IOException, SAXException {
        InputStream input = new FileInputStream(new File("E:\\ttt\\search\\files\\"+filename));
        BodyContentHandler handler = new BodyContentHandler();
        Metadata metadata = new Metadata();
        ParseContext context = new ParseContext();
        Parser parser= new AutoDetectParser();
        try {
            parser.parse(input, handler, metadata, context);
        } catch (TikaException e) {
            e.printStackTrace();
        }
        input.close();
        model.setContent(replaceSpecialStr(handler.toString()));
    }

    /**
     * 去除符号
     * @param str
     * @return
     */
    public static String replaceSpecialStr(String str) {
        String repl = "";
        if (str!=null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            repl = m.replaceAll("");
        }
        return repl;
    }

    public static void downloadFile(String localName,String downloadUrl) throws MalformedURLException {
        int bytesum = 0;
        int byteread = 0;
        URL url = new URL(downloadUrl);
        try {
            URLConnection conn = url.openConnection();
            InputStream inStream = conn.getInputStream();
            //c:/abc.gif
            FileOutputStream fs = new FileOutputStream("E:\\ttt\\search\\files\\"+localName);

            byte[] buffer = new byte[1204];
            int length;
            while ((byteread = inStream.read(buffer)) != -1) {
                bytesum += byteread;
//                System.out.println(bytesum);
                fs.write(buffer, 0, byteread);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
